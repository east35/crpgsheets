#!/usr/bin/env python3
"""Download wiki HTML pages listed in a sitemap.

Example:
  python rt-data-hygiene/download-wiki-pages.py --category Helmet --out rt-data-hygiene/wiki-html/helmets
"""

import argparse
import os
import random
import re
import time
import urllib.parse
import xml.etree.ElementTree as ET

import requests

DEFAULT_SITEMAP_URL = "https://roguetrader.wiki.fextralife.com/sitemap.xml"


def load_sitemap(sitemap_path: str, sitemap_url: str) -> str:
    if os.path.exists(sitemap_path):
        with open(sitemap_path, "r", encoding="utf-8") as f:
            return f.read()
    resp = requests.get(sitemap_url, timeout=60)
    resp.raise_for_status()
    return resp.text


def extract_locs(xml_text: str) -> list[str]:
    root = ET.fromstring(xml_text)
    locs: list[str] = []
    for el in root.iter():
        if el.tag.endswith("loc") and el.text:
            locs.append(el.text.strip())
    return locs


def normalize_title(url: str) -> str:
    # Decode + and %xx so matching is human-readable
    return urllib.parse.unquote_plus(url)


def build_matcher(category: str | None, match: str | None):
    if match:
        pattern = re.compile(match, re.IGNORECASE)
        return lambda url: bool(pattern.search(normalize_title(url)))
    if category:
        pattern = re.compile(rf"\\b{re.escape(category)}\\b", re.IGNORECASE)
        return lambda url: bool(pattern.search(normalize_title(url)))
    return lambda url: True


def safe_filename_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    name = path.rsplit("/", 1)[-1]
    name = urllib.parse.unquote_plus(name)
    name = re.sub(r"[<>:\"/\\|?*]", "", name)
    name = re.sub(r"\s+", "_", name).strip("_")
    if not name:
        name = f"page_{abs(hash(url))}"
    return f"{name}.html"


def download_one(session: requests.Session, url: str, out_path: str, retries: int) -> bool:
    for attempt in range(1, retries + 1):
        try:
            resp = session.get(url, timeout=60)
            resp.raise_for_status()
            with open(out_path, "wb") as f:
                f.write(resp.content)
            return True
        except Exception as exc:
            if attempt == retries:
                print(f"FAIL {url} ({exc})")
                return False
            time.sleep(1.5 * attempt)
    return False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sitemap", default="rt-data-hygiene/sitemap.xml")
    parser.add_argument("--sitemap-url", default=DEFAULT_SITEMAP_URL)
    parser.add_argument("--out", default="rt-data-hygiene/wiki-html")
    parser.add_argument("--category", default=None, help="word to match in page titles, e.g. Helmet")
    parser.add_argument("--match", default=None, help="custom regex, matched against decoded URL/title")
    parser.add_argument("--limit", type=int, default=0, help="max pages to download (0 = no limit)")
    parser.add_argument("--sleep", type=float, default=0.75, help="seconds between requests")
    parser.add_argument("--jitter", type=float, default=0.25, help="random jitter added to sleep")
    parser.add_argument("--retries", type=int, default=3)
    parser.add_argument("--force", action="store_true", help="re-download even if file exists")
    args = parser.parse_args()

    xml_text = load_sitemap(args.sitemap, args.sitemap_url)
    locs = extract_locs(xml_text)
    matcher = build_matcher(args.category, args.match)

    urls = [u for u in locs if matcher(u)]
    if args.limit > 0:
        urls = urls[: args.limit]

    os.makedirs(args.out, exist_ok=True)

    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": "crpg-character-manager/1.0 (data hygiene)"
        }
    )

    print(f"Found {len(urls)} URLs")
    for idx, url in enumerate(urls, 1):
        filename = safe_filename_from_url(url)
        out_path = os.path.join(args.out, filename)

        if os.path.exists(out_path) and not args.force:
            print(f"SKIP {idx}/{len(urls)} {filename}")
        else:
            ok = download_one(session, url, out_path, args.retries)
            status = "OK" if ok else "FAIL"
            print(f"{status} {idx}/{len(urls)} {filename}")

        time.sleep(max(0.0, args.sleep + random.uniform(-args.jitter, args.jitter)))


if __name__ == "__main__":
    main()
