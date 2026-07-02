# 嵌入式项目展示网站

面向 HR 的个人嵌入式项目展示网站，支持视频播放。纯静态页面，可免费部署到 GitHub Pages。

## 快速开始

### 1. 本地预览

直接用浏览器打开 `index.html` 即可预览。

### 2. 修改内容

编辑 `config.js` 文件，修改个人信息和项目数据：

```javascript
const SITE_CONFIG = {
  name: "你的名字",
  title: "你的职位",
  bio: "一句话介绍自己",
  skills: ["技能1", "技能2", ...],
  contact: "你的邮箱",
  projects: [
    {
      name: "项目名称",
      description: "简短描述（显示在首页卡片上）",
      video: "videos/你的视频文件.mp4",
      tags: ["技术标签1", "技术标签2"],
      detail: "详细介绍（显示在弹窗中，支持换行）"
    }
  ]
};
```

### 3. 添加视频

将录制好的视频文件放入 `videos/` 文件夹，然后在 `config.js` 中填写对应的文件路径。

> ⚠️ **注意：** GitHub Pages 单文件限制 100MB，建议将视频压缩到 100MB 以内。如果视频较大，建议上传到 B站/YouTube 后替换为嵌入链接。

## 部署到 GitHub Pages

### 方法一：直接推送（推荐）

1. 在 GitHub 创建一个新仓库，命名为 `你的用户名.github.io`（或任意名称）
2. 将本目录所有文件推送到仓库：

```bash
git init
git add .
git commit -m "初始化项目展示网站"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

3. 在 GitHub 仓库页面 → Settings → Pages → Source 选择 `main` 分支，保存
4. 几分钟后，网站将部署到 `https://你的用户名.github.io/仓库名/`

### 方法二：上传 ZIP

1. 将本目录打包为 ZIP 文件
2. 在 GitHub 创建新仓库
3. 点击 "uploading an existing file"，上传 ZIP 解压后的所有文件
4. 在 Settings → Pages 中启用 GitHub Pages

## 文件结构

```
项目介绍/
├── index.html      # 主页面
├── config.js       # 数据配置（你只需要改这个）
├── style.css       # 样式
├── script.js       # 交互脚本
├── videos/         # 视频文件夹
│   └── *.mp4
└── README.md       # 本文件
```

## 浏览器兼容

支持所有现代浏览器：Chrome、Edge、Firefox、Safari，以及移动端浏览器。
