/**
 * 嵌入式项目展示网站 — 主脚本
 * 负责页面渲染和交互逻辑
 */

(function () {
  "use strict";

  // ========== DOM 引用 ==========
  const $ = (sel) => document.querySelector(sel);

  const heroName = $("#hero-name");
  const heroTitle = $("#hero-title");
  const heroBio = $("#hero-bio");
  const skillsTags = $("#skills-tags");
  const projectList = $("#project-list");
  const footerContact = $("#footer-contact");

  // Modal
  const modalOverlay = $("#modal-overlay");
  const modal = $("#modal");
  const modalClose = $("#modal-close");
  const modalTitle = $("#modal-title");
  const modalVideo = $("#modal-video");
  const modalTags = $("#modal-tags");
  const modalDetail = $("#modal-detail");

  // ========== 渲染页面 ==========

  function renderHero() {
    const avatarImg = $("#avatar-img");
    if (SITE_CONFIG.avatar) {
      avatarImg.src = SITE_CONFIG.avatar;
    } else {
      avatarImg.style.display = "none";
    }
    heroName.textContent = SITE_CONFIG.name;
    heroTitle.textContent = SITE_CONFIG.title;
    heroBio.textContent = SITE_CONFIG.bio;
  }

  function renderSkills() {
    const fragment = document.createDocumentFragment();
    SITE_CONFIG.skills.forEach((skill) => {
      const span = document.createElement("span");
      span.className = "skill-tag";
      span.textContent = skill;
      fragment.appendChild(span);
    });
    skillsTags.appendChild(fragment);
  }

  function renderProjects() {
    const fragment = document.createDocumentFragment();
    SITE_CONFIG.projects.forEach((project, index) => {
      const card = document.createElement("button");
      card.className = "project-card";
      card.setAttribute("data-index", index);
      card.setAttribute("aria-label", `查看项目: ${project.name}`);
      card.addEventListener("click", () => openModal(index));

      // 卡片主体
      const body = document.createElement("div");
      body.className = "project-card-body";

      const nameEl = document.createElement("div");
      nameEl.className = "project-card-name";
      nameEl.textContent = project.name;

      const descEl = document.createElement("div");
      descEl.className = "project-card-desc";
      descEl.textContent = project.description;

      // 标签
      const tagsWrap = document.createElement("div");
      tagsWrap.className = "project-card-tags";
      project.tags.forEach((tag) => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "project-card-tag";
        tagSpan.textContent = tag;
        tagsWrap.appendChild(tagSpan);
      });

      body.appendChild(nameEl);
      body.appendChild(descEl);
      body.appendChild(tagsWrap);

      // 箭头
      const arrow = document.createElement("span");
      arrow.className = "project-card-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "▶";

      card.appendChild(body);
      card.appendChild(arrow);
      fragment.appendChild(card);
    });
    projectList.appendChild(fragment);
  }

  function renderFooter() {
    const c = SITE_CONFIG.contact;
    footerContact.textContent = `📧 ${c.email}`;
  }

  // ========== Modal 逻辑 ==========

  function openModal(index) {
    const project = SITE_CONFIG.projects[index];
    if (!project) return;

    modalTitle.textContent = project.name;

    // 视频
    modalVideo.innerHTML = ""; // 清空旧 source
    const source = document.createElement("source");
    source.src = project.video;
    source.type = "video/mp4";
    modalVideo.appendChild(source);
    modalVideo.load();

    // 标签
    modalTags.innerHTML = "";
    project.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "modal-tag";
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    // 详情
    modalDetail.textContent = project.detail;

    // 显示弹窗
    modalOverlay.classList.add("active");
    document.body.classList.add("modal-open");

    // 自动播放
    modalVideo.play().catch(() => {
      // 浏览器可能阻止自动播放，用户可以手动点击播放
    });

    // 聚焦关闭按钮，方便键盘操作
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.classList.remove("modal-open");

    // 停止视频
    modalVideo.pause();
    modalVideo.currentTime = 0;

    // 延迟清空视频，避免关闭动画时看到视频消失
    setTimeout(() => {
      if (!modalOverlay.classList.contains("active")) {
        modalVideo.innerHTML = "";
      }
    }, 300);
  }

  // ========== 事件绑定 ==========

  // 关闭按钮
  modalClose.addEventListener("click", closeModal);

  // 点击遮罩层关闭
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESC 关闭
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  // 弹窗内部点击不冒泡到遮罩层
  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // ========== 启动 ==========

  function init() {
    renderHero();
    renderSkills();
    renderProjects();
    renderFooter();
  }

  // 等待 DOM 解析完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
