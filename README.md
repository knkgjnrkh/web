# nlklmll 的个人博客

个人技术博客，记录渗透测试、工具配置等学习笔记。纯静态页面，文章以 Markdown 格式维护，通过 `marked.js` 在浏览器端渲染。

## 本地预览

直接打开 `index.html` 时，浏览器会因为 `file://` 协议阻止 `fetch()` 请求导致文章无法加载。需要用一个本地 HTTP 服务器：

**方法 1（推荐）：** VS Code 安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件，右键 `index.html` → Open with Live Server

**方法 2：** Python 一行命令（在项目根目录运行）

```bash
python -m http.server 8080
```

然后浏览器打开 `http://localhost:8080`

## 新增文章

1. 在 `posts/` 下新建一个 `.md` 文件，文件头加 frontmatter：

   ```markdown
   ---
   title: 文章标题
   date: 2026-07-02
   tags: [标签1, 标签2]
   ---

   正文内容…
   ```

2. 将配图放入 `assets/<文章名>/` 目录，Markdown 中引用写 `../assets/<文章名>/图片名.png`

3. 在 `index.html` 的文章列表区新增一个卡片：

   ```html
   <a class="post-card" href="posts/post.html?file=新文章.md">
     <div class="post-card-body">
       <h3 class="post-card-title">文章标题</h3>
       <p class="post-card-excerpt">摘要…</p>
       <div class="post-card-meta">
         <span class="post-date">2026-07-02</span>
         <div class="post-tags">
           <span class="post-tag">标签</span>
         </div>
       </div>
     </div>
     <span class="post-card-arrow" aria-hidden="true">→</span>
   </a>
   ```

## 文件结构

```
├── index.html          # 博客首页（文章列表）
├── style.css           # 全局样式
├── liujun.jpg          # 头像
├── feature-moonbase-img-2f4057.webp  # 首页背景图
├── posts/
│   ├── post.html       # 通用文章渲染模板（无需修改）
│   ├── kali.md
│   ├── vmware.md
│   └── typora.md
└── assets/
    ├── kali/
    ├── vmware/
    └── typora/
```

## 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "init blog"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

仓库 Settings → Pages → Source 选 `main` 分支，几分钟后即可访问。GitHub Pages 走 HTTPS，fetch 完全正常，无需本地服务器。
