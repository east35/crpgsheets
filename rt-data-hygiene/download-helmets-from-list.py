#!/usr/bin/env python3
"""Download helmet pages and tooltip HTML from the Helmets list page."""

import argparse
import os
import re
import time
import urllib.parse

import requests

BASE_URL = "https://roguetrader.wiki.fextralife.com"
DEFAULT_LIST_URL = f"{BASE_URL}/Helmets"


def safe_filename_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    name = path.rsplit("/", 1)[-1]
    name = urllib.parse.unquote_plus(name)
    name = re.sub(r"[<>:\"/\\|?*]", "", name)
    name = re.sub(r"\s+", "_", name).strip("_")
    if not name:
        name = f"page_{abs(hash(url))}"
    return f"{name}.html"


def strip_tags(raw_html: str) -> str:
    cleaned = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw_html)
    cleaned = re.sub(r"(?is)<!--.*?-->", " ", cleaned)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


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


def download(session: requests.Session, url: str, out_path: str, retries: int) -> bool:
    for attempt in range(1, retries + 1):
        try:
            resp = session.get(url, timeout=60)
            resp.raise_for_status()
            with open(out_path, "wb") as f:
                f.write(resp.content)
            return True
        except Exception:
            if attempt == retries:
                return False
            time.sleep(1.5 * attempt)
    return False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--list-url", default=DEFAULT_LIST_URL)
    parser.add_argument("--out-dir", default="rt-data-hygiene/wiki-html/helmets")
    parser.add_argument("--tooltip-dir", default="rt-data-hygiene/wiki-html/helmets/tooltips")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--sleep", type=float, default=0.5)
    parser.add_argument("--jitter", type=float, default=0.25)
    parser.add_argument("--retries", type=int, default=3)
    args = parser.parse_args()

    session = requests.Session()
    session.headers.update({"User-Agent": "crpg-character-manager/1.0 (data hygiene)"})

    list_html = session.get(args.list_url, timeout=60).text
    os.makedirs(args.out_dir, exist_ok=True)
    os.makedirs(args.tooltip_dir, exist_ok=True)

    list_path = os.path.join("rt-data-hygiene/wiki-html", "Helmets.html")
    with open(list_path, "w", encoding="utf-8") as f:
        f.write(list_html)

    items = extract_helmet_links(list_html)
    if args.limit > 0:
        items = items[: args.limit]

    print(f"Found {len(items)} helmet links")

    for idx, item in enumerate(items, 1):
        href = item["href"]
        full_url = href if href.startswith("http") else f"{BASE_URL}{href}"
        tooltip_url = f"{BASE_URL}/_tooltip_{href.lstrip('/')}"

        html_filename = safe_filename_from_url(full_url)
        tooltip_filename = safe_filename_from_url(tooltip_url)

        html_path = os.path.join(args.out_dir, html_filename)
        tooltip_path = os.path.join(args.tooltip_dir, tooltip_filename)

        ok_page = download(session, full_url, html_path, args.retries)
        ok_tip = download(session, tooltip_url, tooltip_path, args.retries)

        status = "OK" if ok_page and ok_tip else "FAIL"
        print(f"{status} {idx}/{len(items)} {html_filename}")

        time.sleep(max(0.0, args.sleep + (args.jitter * (2 * (idx % 2) - 1))))


if __name__ == "__main__":
    main()
