(function () {
  "use strict";

  var storageKey = "theme";
  var root = document.documentElement;

  function preferredTheme() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";

    document.querySelectorAll(".theme-toggle").forEach(function (button) {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "切换到日间模式" : "切换到夜间模式");
      button.title = isDark ? "切换到日间模式" : "切换到夜间模式";

      var icon = button.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = isDark ? "☀" : "☾";
    });
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.dataset.theme || preferredTheme());

    document.querySelectorAll(".theme-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        saveTheme(nextTheme);
        applyTheme(nextTheme);
      });
    });
  });
})();
