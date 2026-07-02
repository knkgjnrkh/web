# 刘俊的个人博客

个人技术博客，记录渗透测试、工具配置等学习笔记。纯静态页面，可免费部署到 GitHub Pages。

## 本地预览

直接用浏览器打开 `index.html` 即可。

## 文件结构

```
├── index.html          # 博客首页（文章列表）
├── style.css           # 全局样式
├── liujun.jpg          # 头像
├── feature-moonbase-img-2f4057.webp  # 首页背景图
├── posts/
│   ├── kali.html       # Kali Linux 虚拟机下载安装和汉化
│   ├── vmware.html     # VMware Pro 下载与安装
│   └── typora.html     # 激活正版 Typora
└── assets/
    ├── kali/           # Kali Linux 文章配图
    ├── vmware/         # VMware 文章配图
    └── typora/         # Typora 文章配图
```

## 新增文章

1. 在 `posts/` 下复制任意已有 `.html` 文件，修改标题、日期、正文内容
2. 将配图放入 `assets/<文章名>/` 目录，HTML 中引用路径写 `../assets/<文章名>/图片名.png`
3. 在 `index.html` 的文章列表区新增一个 `<a class="post-card" href="posts/新文章.html">` 卡片

## 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "init blog"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

推送后进入仓库 Settings → Pages → Source 选择 `main` 分支，几分钟后即可通过 `https://<username>.github.io/<repo>/` 访问。
