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

## 新增文章（现在全自动，不用再手改 index.html）

1. 在 `posts/` 下新建一个 `.md` 文件，文件头加 frontmatter（`date` 可省略，构建时会自动补今天日期）：

   ```markdown
   ---
   title: 文章标题
   tags: [标签1, 标签2]
   ---

   正文内容…
   ```

2. 将配图放入 `assets/<文章名>/` 目录，Markdown 中引用写 `../assets/<文章名>/图片名.png`

3. 双击 `deploy.bat`。它会自动：
   - 运行 `build.py` 扫描所有文章，生成 `posts.json`（首页列表、搜索、推荐都读它）
   - 给没写日期的文章补上今天日期
   - 提交并推送到 GitHub

首页列表、搜索、文章页的目录（TOC）和右侧推荐，全部由 `posts.json` 自动驱动，无需手动维护卡片。

## 本地预览

双击 `preview.bat`（自动起 HTTP 服务并打开浏览器），或手动 `python -m http.server 8080`。

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
