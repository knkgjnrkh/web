# -*- coding: utf-8 -*-
"""
博客构建脚本
------------
1. 扫描 posts/ 下的所有 .md 文章
2. 读取 frontmatter（title / date / tags）
   - 没有 date 的自动补上今天日期，并写回 md 文件
   - 没有 title 的用文件名兜底
3. 自动从正文提取摘要（excerpt）
4. 生成 posts.json 索引，供首页列表、搜索、文章推荐使用

你只管在 posts/ 下用 Typora 写 .md（配图放 assets/<文章名>/），
其余交给 deploy.bat 一键完成。
"""
import os
import re
import json
import datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(ROOT, "posts")
OUTPUT = os.path.join(ROOT, "posts.json")

TODAY = datetime.date.today().strftime("%Y-%m-%d")


def parse_frontmatter(text):
    """解析 --- ... --- 之间的 YAML-lite 元数据，返回 (meta, body, raw_fm_exists)。"""
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?(.*)$", text, re.S)
    if not m:
        return {}, text, False
    meta = {}
    for line in m.group(1).split("\n"):
        i = line.find(":")
        if i < 0:
            continue
        key = line[:i].strip()
        val = line[i + 1:].strip()
        if val.startswith("[") and val.endswith("]"):
            val = [s.strip() for s in val[1:-1].split(",") if s.strip()]
        meta[key] = val
    return meta, m.group(2), True


def make_excerpt(body, limit=60):
    """从正文提取纯文本摘要：去掉图片、标题符号、代码块、链接语法。"""
    text = body
    text = re.sub(r"```.*?```", "", text, flags=re.S)   # 代码块
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)          # 图片
    text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)       # 链接保留文字
    text = re.sub(r"[#>*`\-]", "", text)                  # markdown 符号
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit] + ("…" if len(text) > limit else "")


def ensure_date(path, text, meta, has_fm):
    """如果文章没写 date，就补上今天日期并写回文件。返回最终 date。"""
    if meta.get("date"):
        return meta["date"]

    if has_fm:
        # 已有 frontmatter 但缺 date：在第一个 --- 之后插入 date 行
        new_text = re.sub(
            r"^(---\r?\n)",
            r"\g<1>date: " + TODAY + "\n",
            text,
            count=1,
        )
    else:
        # 完全没有 frontmatter：在文件最前面补一段
        title = os.path.splitext(os.path.basename(path))[0]
        fm = "---\ntitle: {}\ndate: {}\ntags: []\n---\n\n".format(title, TODAY)
        new_text = fm + text

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_text)
    print("  + 已为《{}》补充日期 {}".format(os.path.basename(path), TODAY))
    return TODAY


def build():
    posts = []
    for name in sorted(os.listdir(POSTS_DIR)):
        if not name.lower().endswith(".md"):
            continue
        path = os.path.join(POSTS_DIR, name)
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()

        meta, body, has_fm = parse_frontmatter(text)
        date = ensure_date(path, text, meta, has_fm)

        title = meta.get("title") or os.path.splitext(name)[0]
        tags = meta.get("tags") if isinstance(meta.get("tags"), list) else []
        excerpt = meta.get("excerpt") or make_excerpt(body)

        posts.append({
            "file": name,
            "title": title,
            "date": date,
            "tags": tags,
            "excerpt": excerpt,
        })

    # 按日期倒序（最新在前）
    posts.sort(key=lambda p: p["date"], reverse=True)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    print("已生成 posts.json，共 {} 篇文章：".format(len(posts)))
    for p in posts:
        print("  - [{}] {}".format(p["date"], p["title"]))


if __name__ == "__main__":
    build()
