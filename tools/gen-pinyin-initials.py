#!/usr/bin/env python3
"""Generate pinyin-initials.js from the Chinese text in the cheatsheet corpus.

Dev-only helper. Requires pypinyin (not a runtime dependency). The emitted
pinyin-initials.js is plain static JS with no dependency. Re-run after adding
tools so newly introduced Chinese characters get pinyin-initial coverage:

    .venv/bin/python -m pip install pypinyin
    .venv/bin/python tools/gen-pinyin-initials.py
"""
import glob
import os
import re

from pypinyin import Style, pinyin

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HANZI_RE = re.compile(r"[一-鿿]")

# Searchable corpora: generated tool data, curated enrichments/examples, the
# recommendation pool, and the synonym groups in product-core.
GLOBS = [
    "data/*.js",
    "enrichments/*.js",
    "usage-examples.js",
    "popup-state.js",
    "product-core.js",
    "shared/*.json",
]


def collect_hanzi():
    chars = set()
    for pattern in GLOBS:
        for path in glob.glob(os.path.join(ROOT, pattern)):
            with open(path, "r", encoding="utf-8") as handle:
                chars.update(HANZI_RE.findall(handle.read()))
    return sorted(chars)


def initial_of(char):
    letter = pinyin(char, style=Style.FIRST_LETTER, errors="ignore")
    if not letter or not letter[0]:
        return ""
    first = letter[0][0].lower()
    return first if "a" <= first <= "z" else ""


def main():
    chars = collect_hanzi()
    hanzi = []
    initials = []
    for char in chars:
        letter = initial_of(char)
        if not letter:
            continue
        hanzi.append(char)
        initials.append(letter)

    hanzi_str = "".join(hanzi)
    initials_str = "".join(initials)
    out_path = os.path.join(ROOT, "pinyin-initials.js")
    with open(out_path, "w", encoding="utf-8") as handle:
        handle.write(
            "(function (globalScope) {\n"
            "  \"use strict\";\n"
            "  // 由 tools/gen-pinyin-initials.py 生成（基于 pypinyin），请勿手改。\n"
            "  // 覆盖速查数据中出现的汉字 -> 拼音首字母，用于拼音首字母搜索的兜底匹配。\n"
            f"  const HANZI = {js_string(hanzi_str)};\n"
            f"  const INITIALS = {js_string(initials_str)};\n"
            "  const map = Object.create(null);\n"
            "  for (let i = 0; i < HANZI.length; i++) map[HANZI[i]] = INITIALS[i];\n"
            "  globalScope.PINYIN_INITIALS = map;\n"
            "  if (typeof module !== \"undefined\" && module.exports) module.exports = map;\n"
            "}(typeof window !== \"undefined\" ? window : globalThis));\n"
        )
    print(f"wrote {out_path}: {len(hanzi)} characters")


def js_string(value):
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return '"' + escaped + '"'


if __name__ == "__main__":
    main()
