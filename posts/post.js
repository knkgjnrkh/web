(function () {
  "use strict";

  /* ——— 工具函数 ——— */

  // 从 ?file=xxx.md 获取目标文件名
  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  // 解析 YAML-lite frontmatter（--- ... ---）
  function parseFrontmatter(text) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) return { meta: {}, body: text };
    const meta = {};
    m[1].split("\n").forEach(function (line) {
      const i = line.indexOf(":");
      if (i < 0) return;
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      if (val.startsWith("[") && val.endsWith("]")) {
        val = val.slice(1, -1).split(",").map(function (s) { return s.trim(); });
      }
      meta[key] = val;
    });
    return { meta: meta, body: m[2] };
  }

  // 把解析出的元数据渲染到页面头部
  function setMeta(meta) {
    const title = meta.title || "文章";
    document.title = title + " — nlklmll的博客";
    document.getElementById("article-title").textContent = title;
    document.getElementById("article-date").textContent = meta.date || "";

    const tagsEl = document.getElementById("article-tags");
    const tags = Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []);
    tags.forEach(function (tag) {
      const span = document.createElement("span");
      span.className = "post-tag";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });
    return { title: title, tags: tags };
  }

  // 给正文里的标题加 id，并生成左侧目录（TOC）
  function buildTOC(contentEl) {
    const headings = contentEl.querySelectorAll("h1, h2, h3, h4");
    const tocEl = document.getElementById("toc");
    if (!headings.length) {
      document.getElementById("toc-sidebar").style.display = "none";
      return;
    }
    const list = document.createElement("ul");
    list.className = "toc-list";
    headings.forEach(function (h, idx) {
      const id = "h-" + idx;
      h.id = id;
      const li = document.createElement("li");
      li.className = "toc-item toc-" + h.tagName.toLowerCase();
      const a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = h.textContent;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", "#" + id);
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    tocEl.appendChild(list);
    setupTOCHighlight(headings);
  }

  // 滚动时高亮当前所在章节
  function setupTOCHighlight(headings) {
    const links = document.querySelectorAll(".toc-list a");
    function onScroll() {
      let current = 0;
      headings.forEach(function (h, idx) {
        if (h.getBoundingClientRect().top <= 120) current = idx;
      });
      links.forEach(function (a, idx) {
        a.classList.toggle("active", idx === current);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 生成右侧推荐文章（优先共同标签，不足则用最新文章补齐）
  function buildRecommend(currentFile, currentTags) {
    fetch("../posts.json")
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (posts) {
        const others = posts.filter(function (p) { return p.file !== currentFile; });
        others.forEach(function (p) {
          const shared = (p.tags || []).filter(function (t) {
            return currentTags.indexOf(t) !== -1;
          });
          p._score = shared.length;
        });
        others.sort(function (a, b) {
          if (b._score !== a._score) return b._score - a._score;
          return (b.date || "").localeCompare(a.date || "");
        });
        const picks = others.slice(0, 5);
        const box = document.getElementById("rec-list");
        if (!picks.length) {
          document.getElementById("rec-sidebar").style.display = "none";
          return;
        }
        picks.forEach(function (p) {
          const a = document.createElement("a");
          a.className = "rec-item";
          a.href = "post.html?file=" + encodeURIComponent(p.file);
          a.innerHTML =
            '<span class="rec-title">' + p.title + "</span>" +
            '<span class="rec-date">' + (p.date || "") + "</span>";
          box.appendChild(a);
        });
      })
      .catch(function () {
        document.getElementById("rec-sidebar").style.display = "none";
      });
  }

  /* ——— 主逻辑 ——— */

  const file = getParam("file");
  if (!file) {
    window.location.replace("../index.html");
    return;
  }

  const renderer = new marked.Renderer();
  renderer.image = function (href, title, text) {
    const titleAttr = title ? ' title="' + title + '"' : "";
    return '<img src="' + href + '" alt="' + (text || "") + '"' + titleAttr + ' loading="lazy">';
  };
  marked.setOptions({ breaks: true, renderer: renderer });

  fetch(file)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then(function (text) {
      const parsed = parseFrontmatter(text);
      const info = setMeta(parsed.meta);
      const contentEl = document.getElementById("content");
      contentEl.innerHTML = marked.parse(parsed.body);
      buildTOC(contentEl);
      buildRecommend(file, info.tags);
    })
    .catch(function () {
      document.getElementById("article-title").textContent = "加载失败";
      document.getElementById("content").innerHTML =
        "<p>文章加载失败。如果是本地预览，请使用 HTTP 服务器（VS Code → Live Server 或 python -m http.server）而非直接打开文件。</p>";
    });
})();
