#!/usr/bin/env python3
"""Parse downloaded wiki HTML pages into per-item JSON files.

This is a best-effort parser that pulls title, infobox fields, images,
first-paragraph description, and effect-like fields when present.
"""

import argparse
import html as html_lib
import json
import os
import re
import time
import urllib.parse
import xml.etree.ElementTree as ET

DEFAULT_SITEMAP_PATH = "rt-data-hygiene/sitemap.xml"
DEFAULT_HTML_DIR = "rt-data-hygiene/wiki-html/helmets"
DEFAULT_OUT_DIR = "rt-data-hygiene/wiki-json/helmets"
DEFAULT_MANUAL_PATH = "rt-data-hygiene/manual-helmets.json"


TAG_RE = re.compile(r"<[^>]+>")
SCRIPT_STYLE_RE = re.compile(r"(?is)<(script|style)[^>]*>.*?</\1>")
COMMENT_RE = re.compile(r"(?is)<!--.*?-->")


def strip_tags(raw_html: str) -> str:
    cleaned = SCRIPT_STYLE_RE.sub(" ", raw_html)
    cleaned = COMMENT_RE.sub(" ", cleaned)
    cleaned = TAG_RE.sub(" ", cleaned)
    cleaned = html_lib.unescape(cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def strip_tags_keep_breaks(raw_html: str) -> str:
    cleaned = SCRIPT_STYLE_RE.sub(" ", raw_html)
    cleaned = COMMENT_RE.sub(" ", cleaned)
    cleaned = re.sub(r"(?i)<br\s*/?>", "\n", cleaned)
    cleaned = re.sub(r"(?i)</p>", "\n", cleaned)
    cleaned = re.sub(r"(?i)<p[^>]*>", "", cleaned)
    cleaned = TAG_RE.sub(" ", cleaned)
    cleaned = html_lib.unescape(cleaned)
    cleaned = re.sub(r"[ \t\r\f\v]+", " ", cleaned)
    cleaned = re.sub(r"\n\s*", "\n", cleaned)
    cleaned = re.sub(r"\n{2,}", "\n", cleaned)
    return cleaned.strip()


def safe_filename_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    name = path.rsplit("/", 1)[-1]
    name = urllib.parse.unquote_plus(name)
    name = re.sub(r"[<>:\"/\\|?*]", "", name)
    name = re.sub(r"\s+", "_", name).strip("_")
    if not name:
        name = f"page_{abs(hash(url))}"
    return f"{name}.html"


def tooltip_filename_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    slug = path.rsplit("/", 1)[-1]
    tooltip_path = f"/_tooltip_{slug}"
    return safe_filename_from_url(tooltip_path)


def extract_locs(xml_text: str) -> list[str]:
    root = ET.fromstring(xml_text)
    locs: list[str] = []
    for el in root.iter():
        if el.tag.endswith("loc") and el.text:
            locs.append(el.text.strip())
    return locs


def normalize_title(url: str) -> str:
    return urllib.parse.unquote_plus(url)


def build_matcher(match: str | None):
    if match:
        pattern = re.compile(match, re.IGNORECASE)
        return lambda url: bool(pattern.search(normalize_title(url)))
    return lambda url: True


def extract_title(html: str) -> str:
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.IGNORECASE | re.DOTALL)
    if m:
        title = strip_tags(m.group(1))
        return re.sub(r"\s*\\|\\s*Rogue Trader Wiki$", "", title).strip()
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    if m:
        title = strip_tags(m.group(1))
        title = re.sub(r"\s*\\|\\s*Rogue Trader Wiki$", "", title).strip()
        title = re.sub(r"\s*-\\s*Rogue Trader Wiki$", "", title).strip()
        return title
    return ""


def extract_first_paragraph(html: str) -> str:
    m = re.search(r"<p[^>]*>(.*?)</p>", html, re.IGNORECASE | re.DOTALL)
    if m:
        return strip_tags(m.group(1))
    return ""


def extract_infobox(html: str) -> tuple[dict[str, str], list[str]]:
    infobox: dict[str, str] = {}
    images: list[str] = []

    table_re = re.compile(
        r"<table[^>]*class=\"[^\"]*(infobox|wiki_table|table_info)[^\"]*\"[^>]*>(.*?)</table>",
        re.IGNORECASE | re.DOTALL,
    )
    row_re = re.compile(r"<tr[^>]*>(.*?)</tr>", re.IGNORECASE | re.DOTALL)

    for table_match in table_re.finditer(html):
        table_html = table_match.group(2)

        for img_match in re.finditer(r"<img[^>]*>", table_html, re.IGNORECASE):
            tag = img_match.group(0)
            for attr in ("data-src", "data-original", "data-lazy-src", "src"):
                attr_match = re.search(rf"{attr}=\"([^\"]+)\"", tag, re.IGNORECASE)
                if attr_match:
                    images.append(attr_match.group(1))
                    break

        for row_match in row_re.finditer(table_html):
            row_html = row_match.group(1)
            th = re.search(r"<th[^>]*>(.*?)</th>", row_html, re.IGNORECASE | re.DOTALL)
            td = re.search(r"<td[^>]*>(.*?)</td>", row_html, re.IGNORECASE | re.DOTALL)
            if not th or not td:
                continue
            key = strip_tags(th.group(1))
            value = strip_tags(td.group(1))
            if key and value:
                infobox[key] = value

    return infobox, images


def extract_helmet_links(html: str) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    anchor_re = re.compile(
        r'<a[^>]*class="[^"]*wiki_tooltip[^"]*"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
        re.IGNORECASE | re.DOTALL,
    )
    img_re = re.compile(r'<img[^>]*src="([^"]+)"', re.IGNORECASE)
    for match in anchor_re.finditer(html):
        href = match.group(1)
        body = match.group(2)
        name = strip_tags(body)
        name = name.replace("\n", " ").strip()
        img_match = img_re.search(body)
        image = img_match.group(1) if img_match else ""
        if href and name:
            items.append({"href": href, "name": name, "image": image})
    return items


def extract_images(html: str) -> list[str]:
    images: list[str] = []
    for img_match in re.finditer(r"<img[^>]*>", html, re.IGNORECASE):
        tag = img_match.group(0)
        for attr in ("data-src", "data-original", "data-lazy-src", "src"):
            attr_match = re.search(rf"{attr}=\"([^\"]+)\"", tag, re.IGNORECASE)
            if attr_match:
                images.append(attr_match.group(1))
                break
    return images


def is_relevant_image(url: str) -> bool:
    lowered = url.lower()
    return "/file/" in lowered or "rogue-trader" in lowered or "roguetrader" in lowered


def extract_tables(html: str) -> list[dict]:
    tables: list[dict] = []
    table_re = re.compile(r"<table[^>]*>(.*?)</table>", re.IGNORECASE | re.DOTALL)
    for table_match in table_re.finditer(html):
        table_html = table_match.group(1)
        if "tagged-pages-container" in table_html:
            continue
        rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table_html, re.IGNORECASE | re.DOTALL)
        parsed_rows: list[list[str]] = []
        for row_html in rows:
            cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row_html, re.IGNORECASE | re.DOTALL)
            if not cells:
                continue
            parsed_rows.append([strip_tags(c) for c in cells])
        if not parsed_rows:
            continue
        headers = parsed_rows[0]
        body = parsed_rows[1:] if len(parsed_rows) > 1 else []
        flat_cells = [cell.lower() for row in parsed_rows for cell in row]
        if any("all helmets in rogue trader" in cell for cell in flat_cells):
            continue
        tables.append(
            {
                "title": " | ".join([h for h in headers if h]).strip() if headers else "",
                "rows": body,
            }
        )
    return tables


def extract_sections(html: str) -> dict[str, str]:
    sections: dict[str, str] = {}
    heading_re = re.compile(r"<h[2-4][^>]*>(.*?)</h[2-4]>", re.IGNORECASE | re.DOTALL)
    matches = list(heading_re.finditer(html))
    for idx, match in enumerate(matches):
        title = strip_tags(match.group(1))
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(html)
        body_html = html[start:end]
        body_text = strip_tags(body_html)
        if title and body_text:
            sections[title] = body_text
    return sections


def find_effect(infobox: dict[str, str]) -> str:
    for key in infobox.keys():
        lowered = key.lower()
        if "effect" in lowered or "effects" in lowered:
            return infobox[key]
        if "description" in lowered:
            return infobox[key]
    return ""


def find_slot(infobox: dict[str, str]) -> str:
    for key, value in infobox.items():
        lowered = key.lower()
        if "slot" in lowered:
            return value
        if "equipment" in lowered and "slot" in lowered:
            return value
    return ""


def find_type(infobox: dict[str, str]) -> str:
    for key, value in infobox.items():
        lowered = key.lower()
        if "type" in lowered or "category" in lowered:
            return value
    return ""


def find_rarity(infobox: dict[str, str]) -> str:
    for key, value in infobox.items():
        lowered = key.lower()
        if "rarity" in lowered or "quality" in lowered:
            return value
    return ""


def find_requirements(infobox: dict[str, str], sections: dict[str, str]) -> list[str]:
    reqs: list[str] = []
    for key, value in infobox.items():
        lowered = key.lower()
        if "requirement" in lowered or "restriction" in lowered:
            reqs.append(value)
    for title, body in sections.items():
        lowered = title.lower()
        if "requirement" in lowered or "restriction" in lowered:
            reqs.append(body)
    return [r for r in reqs if r]


def find_flavor_text(sections: dict[str, str], fallback: str) -> str:
    for title, body in sections.items():
        lowered = title.lower()
        if "lore" in lowered or "flavor" in lowered or "flavour" in lowered:
            return body
        if "description" in lowered:
            return body
    return fallback


def parse_tooltip_html(html: str) -> dict:
    title = ""
    image = ""
    effect_text = ""
    requirements: list[str] = []
    keywords: list[str] = []

    title_match = re.search(r'<h2[^>]*class="ci_type1"[^>]*>(.*?)</h2>', html, re.IGNORECASE | re.DOTALL)
    if title_match:
        title = strip_tags(title_match.group(1))

    img_match = re.search(r'<img[^>]*src="([^"]+)"', html, re.IGNORECASE)
    if img_match:
        image = img_match.group(1)

    effect_match = re.search(r'<td[^>]*class="ci_effect"[^>]*>(.*?)</td>', html, re.IGNORECASE | re.DOTALL)
    if effect_match:
        effect_text = strip_tags_keep_breaks(effect_match.group(1))
        for kw in re.findall(r'<span[^>]*style="[^"]*#85692d[^"]*"[^>]*>(.*?)</span>', effect_match.group(1), re.IGNORECASE | re.DOTALL):
            key = strip_tags(kw)
            if key:
                keywords.append(key)

    if effect_text:
        lines = [line.strip() for line in effect_text.split("\n") if line.strip()]
        kept_lines = []
        for line in lines:
            if re.match(r"(?i)^requires?\b", line) or re.match(r"(?i)^requirements?\b", line):
                requirements.append(line)
            else:
                kept_lines.append(line)
        effect_text = " ".join(kept_lines).strip()

    return {
        "title": title,
        "image": image,
        "effect": effect_text,
        "requirements": requirements,
        "keywords": list(dict.fromkeys(keywords)),
    }


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")
    return slug or "item"


def parse_html_file(path: str, url: str | None) -> dict:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    title = extract_title(html)
    infobox, images = extract_infobox(html)
    page_images = extract_images(html)
    tables = extract_tables(html)
    sections = extract_sections(html)
    effect = find_effect(infobox)
    description = extract_first_paragraph(html)
    slot = find_slot(infobox)
    item_type = find_type(infobox)
    rarity = find_rarity(infobox)
    requirements = find_requirements(infobox, sections)
    flavor_text = find_flavor_text(sections, description)

    item = {
        "id": slugify(title) if title else slugify(os.path.basename(path)),
        "name": title,
        "wikiUrl": url,
        "sourceHtml": os.path.relpath(path),
        "images": list(dict.fromkeys([img for img in (images + page_images) if img and is_relevant_image(img)])),
        "slot": slot,
        "type": item_type,
        "rarity": rarity,
        "infobox": infobox,
        "statsTables": tables,
        "requirements": requirements,
        "effect": effect,
        "description": description,
        "flavorText": flavor_text,
        "parsedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    stats: list[dict[str, str]] = []
    if slot:
        stats.append({"label": "Slot", "value": slot})
    if item_type:
        stats.append({"label": "Type", "value": item_type})
    if rarity:
        stats.append({"label": "Rarity", "value": rarity})
    for req in requirements:
        stats.append({"label": "Requirements", "value": req})
    if effect:
        stats.append({"label": "Effect", "value": effect})
    item["stats"] = stats
    return item


def normalize_manual_item(raw: dict) -> dict:
    name = raw.get("name", "").strip()
    slug = slugify(name) if name else slugify(raw.get("id", "item"))
    effect = raw.get("effect", "").strip()
    requirements = [r for r in raw.get("requirements", []) if r]
    keywords = [k for k in raw.get("keywords", []) if k]
    images = [img for img in raw.get("images", []) if img]
    item = {
        "id": slug,
        "name": name,
        "wikiUrl": raw.get("wikiUrl"),
        "sourceHtml": None,
        "images": list(dict.fromkeys(images)),
        "slot": raw.get("slot", "Helmet"),
        "type": raw.get("type", ""),
        "rarity": raw.get("rarity", ""),
        "infobox": raw.get("infobox", {}),
        "statsTables": raw.get("statsTables", []),
        "requirements": requirements,
        "effect": effect,
        "description": raw.get("description", ""),
        "flavorText": raw.get("flavorText", ""),
        "parsedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "sourceTooltip": raw.get("sourceTooltip"),
        "keywords": keywords,
    }
    stats: list[dict[str, str]] = []
    if item.get("slot"):
        stats.append({"label": "Slot", "value": item.get("slot", "")})
    if item.get("type"):
        stats.append({"label": "Type", "value": item.get("type", "")})
    if item.get("rarity"):
        stats.append({"label": "Rarity", "value": item.get("rarity", "")})
    for req in requirements:
        stats.append({"label": "Requirements", "value": req})
    if effect:
        stats.append({"label": "Effect", "value": effect})
    item["stats"] = stats
    return item


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sitemap", default=DEFAULT_SITEMAP_PATH)
    parser.add_argument("--html-dir", default=DEFAULT_HTML_DIR)
    parser.add_argument("--out-dir", default=DEFAULT_OUT_DIR)
    parser.add_argument("--helmets-page", default="rt-data-hygiene/wiki-html/Helmets.html")
    parser.add_argument("--tooltip-dir", default="rt-data-hygiene/wiki-html/helmets/tooltips")
    parser.add_argument("--match", default=r"\bHelm(et)?\b", help="regex matched against decoded URL/title")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--manual", default=DEFAULT_MANUAL_PATH)
    args = parser.parse_args()

    if not os.path.exists(args.html_dir):
        raise SystemExit(f"HTML dir not found: {args.html_dir}")

    urls: list[str] = []
    helmet_list: list[dict[str, str]] = []

    if os.path.exists(args.helmets_page):
        helmets_html = open(args.helmets_page, "r", encoding="utf-8", errors="ignore").read()
        helmet_list = extract_helmet_links(helmets_html)
        for item in helmet_list:
            href = item.get("href", "")
            if href.startswith("http"):
                urls.append(href)
            else:
                urls.append(f"https://roguetrader.wiki.fextralife.com{href}")
    else:
        if not os.path.exists(args.sitemap):
            raise SystemExit(f"Sitemap not found: {args.sitemap}")
        with open(args.sitemap, "r", encoding="utf-8") as f:
            xml_text = f.read()
        locs = extract_locs(xml_text)
        matcher = build_matcher(args.match)
        urls = [u for u in locs if matcher(u)]

    if args.limit > 0:
        urls = urls[: args.limit]

    os.makedirs(args.out_dir, exist_ok=True)

    items = []
    missing = []
    for url in urls:
        filename = safe_filename_from_url(url)
        html_path = os.path.join(args.html_dir, filename)
        tooltip_filename = tooltip_filename_from_url(url)
        tooltip_path = os.path.join(args.tooltip_dir, tooltip_filename)
        list_image = ""

        if helmet_list:
            for item in helmet_list:
                href = item.get("href", "")
                full = href if href.startswith("http") else f"https://roguetrader.wiki.fextralife.com{href}"
                if full == url:
                    list_image = item.get("image", "")
                    break

        tooltip_data = {}
        if os.path.exists(tooltip_path):
            tooltip_html = open(tooltip_path, "r", encoding="utf-8", errors="ignore").read()
            tooltip_data = parse_tooltip_html(tooltip_html)
        if not os.path.exists(html_path):
            missing.append(filename)
            fallback_name = tooltip_data.get("title", "") or os.path.splitext(filename)[0]
            item = {
                "id": slugify(fallback_name),
                "name": tooltip_data.get("title", ""),
                "wikiUrl": url,
                "sourceHtml": None,
                "images": list(dict.fromkeys([img for img in [list_image, tooltip_data.get("image", "")] if img and is_relevant_image(img)])),
                "slot": "Helmet",
                "type": "",
                "rarity": "",
                "infobox": {},
                "statsTables": [],
                "requirements": tooltip_data.get("requirements", []),
                "effect": tooltip_data.get("effect", ""),
                "description": "",
                "flavorText": "",
                "parsedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "sourceTooltip": os.path.relpath(tooltip_path) if os.path.exists(tooltip_path) else None,
                "keywords": tooltip_data.get("keywords", []),
            }
        else:
            item = parse_html_file(html_path, url)
            if tooltip_data:
                if tooltip_data.get("title"):
                    item["name"] = tooltip_data.get("title")
                    item["id"] = slugify(tooltip_data.get("title"))
                if tooltip_data.get("effect"):
                    item["effect"] = tooltip_data.get("effect")
                tooltip_reqs = tooltip_data.get("requirements", [])
                if tooltip_reqs:
                    item["requirements"] = list(dict.fromkeys(item.get("requirements", []) + tooltip_reqs))
                if tooltip_data.get("keywords"):
                    item["keywords"] = tooltip_data.get("keywords")
                if tooltip_data.get("image"):
                    item["images"] = list(
                        dict.fromkeys(
                            [img for img in item.get("images", []) + [tooltip_data.get("image")] if img and is_relevant_image(img)]
                        )
                    )
            if list_image:
                item["images"] = list(
                    dict.fromkeys(
                        [img for img in item.get("images", []) + [list_image] if img and is_relevant_image(img)]
                    )
                )
            if not item.get("slot"):
                item["slot"] = "Helmet"
            item["sourceTooltip"] = os.path.relpath(tooltip_path) if os.path.exists(tooltip_path) else None
            stats: list[dict[str, str]] = []
            if item.get("slot"):
                stats.append({"label": "Slot", "value": item.get("slot", "")})
            if item.get("type"):
                stats.append({"label": "Type", "value": item.get("type", "")})
            if item.get("rarity"):
                stats.append({"label": "Rarity", "value": item.get("rarity", "")})
            for req in item.get("requirements", []):
                stats.append({"label": "Requirements", "value": req})
            if item.get("effect"):
                stats.append({"label": "Effect", "value": item.get("effect", "")})
            item["stats"] = stats
        items.append(item)

        out_path = os.path.join(args.out_dir, f"{item['id']}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(item, f, ensure_ascii=True, indent=2)

    if os.path.exists(args.manual):
        with open(args.manual, "r", encoding="utf-8") as f:
            manual_items = json.load(f)
        if isinstance(manual_items, dict):
            manual_items = manual_items.get("items", [])
        if manual_items:
            by_id = {item["id"]: item for item in items if item.get("id")}
            for raw in manual_items:
                manual_item = normalize_manual_item(raw)
                existing = by_id.get(manual_item["id"])
                if existing:
                    for key in ("effect", "requirements", "keywords", "images", "wikiUrl", "rarity", "type"):
                        if not existing.get(key) and manual_item.get(key):
                            existing[key] = manual_item[key]
                    if not existing.get("stats"):
                        existing["stats"] = manual_item.get("stats", [])
                else:
                    items.append(manual_item)
                    by_id[manual_item["id"]] = manual_item
                    out_path = os.path.join(args.out_dir, f"{manual_item['id']}.json")
                    with open(out_path, "w", encoding="utf-8") as f:
                        json.dump(manual_item, f, ensure_ascii=True, indent=2)

    index_path = os.path.join(args.out_dir, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=True, indent=2)

    print(f"Parsed {len(items)} items")
    if missing:
        print(f"Missing {len(missing)} HTML files (run downloader). First 10:")
        for name in missing[:10]:
            print(f"- {name}")


if __name__ == "__main__":
    main()
