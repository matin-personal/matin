// === script.js (clean & robust) ===
const supportedLangs = ["fa", "en"];

/* ------------ Language Button ------------ */
// حذف تمام نودهای متنیِ اضافه، نگه‌داشتن/ایجاد فقط img + span
function normalizeLangButton(btn) {
  // پاک کردن نودهای متنی/فضای سفید
  [...btn.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) btn.removeChild(n);
  });

  let img = btn.querySelector("#lang-flag");
  if (!img) {
    img = document.createElement("img");
    img.id = "lang-flag";
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.borderRadius = "50%";
    img.style.boxShadow = "0 0 4px rgba(0,0,0,.25)";
    btn.prepend(img);
  }

  let label = btn.querySelector("span");
  if (!label) {
    label = document.createElement("span");
    label.style.marginInlineStart = ".5rem";
    btn.appendChild(label);
  }

  return { img, label };
}

function updateLangButtonUI(currentLang) {
  const next = currentLang === "fa" ? "en" : "fa";
  document.querySelectorAll("#lang-btn, .lang-button").forEach((btn) => {
    try {
      const { img, label } = normalizeLangButton(btn);
      const isEN = next === "en";
      img.setAttribute("src", isEN ? "/images/flag-usa.webp" : "/images/flag-iran.webp");
      img.setAttribute("alt", isEN ? "English" : "فارسی");
      label.textContent = isEN ? "English" : "فارسی";
      btn.setAttribute("data-lang", next);
      btn.setAttribute("aria-label", isEN ? "Switch language to English" : "تغییر زبان به فارسی");
    } catch (e) {
      console.warn("updateLangButtonUI error", e);
    }
  });
}

function initLanguage() {
  const saved = localStorage.getItem("lang");
  const browser = (navigator.language || "fa").slice(0, 2);
  const initial = saved || (supportedLangs.includes(browser) ? browser : "fa");

  document.documentElement.lang = initial;
  document.documentElement.dir = initial === "fa" ? "rtl" : "ltr";
  updateLangButtonUI(initial);

  if (!saved) {
    localStorage.setItem("lang", initial);
    if (initial === "en" && !location.pathname.startsWith("/en")) {
      location.href = "/en/"; return;
    }
    if (initial === "fa" &&  location.pathname.startsWith("/en")) {
      location.href = "/";    return;
    }
  }
}

function changeLanguageTo(newLang) {
  const target = supportedLangs.includes(newLang) ? newLang : "fa";
  localStorage.setItem("lang", target);

  if (target === "en") {
    if (!location.pathname.startsWith("/en")) { location.href = "/en/"; return; }
  } else {
    if (location.pathname.startsWith("/en")) { location.href = "/"; return; }
  }

  document.documentElement.lang = target;
  document.documentElement.dir  = target === "fa" ? "rtl" : "ltr";
  updateLangButtonUI(target);
  updateThemeButtonText(); // همگام با زبان
}

/* ------------ Theme ------------ */
function updateThemeButtonText() {
  const lang = document.documentElement.lang || "fa";
  const text = lang === "en" ? "Change Theme" : " تغییر تم";
  document.querySelectorAll("#toggle-theme, .toggle-theme")
    .forEach((btn) => (btn.textContent = text));
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeButtonText();
  if (typeof updateShapes === "function") { try { updateShapes(); } catch (_) {} }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");
}

function initTheme() {
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = localStorage.getItem("theme");
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

/* ------------ Footer (cache-bust) ------------ */
function loadFooter() {
  const wrap = document.getElementById("footer-placeholder");
  if (!wrap) return;
  fetch("/footer.html?v=20250816")
    .then((r) => { if (!r.ok) throw new Error("footer load failed"); return r.text(); })
    .then((html) => (wrap.innerHTML = html))
    .catch((err) => console.warn("Footer load failed:", err));
}

/* ------------ Startup ------------ */
document.addEventListener("DOMContentLoaded", () => {
  try {
    initLanguage();
    initTheme();
    loadFooter();

    // bind language buttons
    document.querySelectorAll("#lang-btn, .lang-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetLang =
          btn.getAttribute("data-lang") ||
          (document.documentElement.lang === "fa" ? "en" : "fa");
        changeLanguageTo(targetLang);
      });
    });

    // bind theme buttons
    document.querySelectorAll("#toggle-theme, .toggle-theme").forEach((t) => {
      t.addEventListener("click", (e) => { e.preventDefault(); toggleTheme(); });
    });
  } catch (err) {
    console.error("Initialization error:", err);
  }
});
/* ========== Header Loader ========== */
function loadHeader() {
  const host = document.getElementById("header-placeholder");
  if (!host) return Promise.resolve();
  const v = "20250817"; // کش‌شکن – هر بار تغییرش بده
  return fetch(`/header.html?v=${v}`)
    .then(r => { if (!r.ok) throw new Error("header load failed"); return r.text(); })
    .then(html => { host.innerHTML = html; })
    .catch(err => console.warn("Header load failed:", err));
}

/* ========== Language ========== */
const _langs = ["fa", "en"];

function _setDirByLang(l) {
  document.documentElement.lang = l;
  document.documentElement.dir  = l === "fa" ? "rtl" : "ltr";
}

function _updateLangButtonUI(curLang) {
  const next = curLang === "fa" ? "en" : "fa";
  document.querySelectorAll("#lang-btn,.lang-button").forEach(btn => {
    const flag = btn.querySelector("#lang-flag");
    const label = btn.querySelector(".lang-label");
    if (flag) {
      flag.src = next === "en" ? "/images/flag-usa.webp" : "/images/flag-iran.webp";
      flag.alt = next === "en" ? "English" : "فارسی";
    }
    if (label) label.textContent = next === "en" ? "English" : "فارسی";
    btn.setAttribute("data-lang", next);
    btn.setAttribute("aria-label", next === "en" ? "Switch language to English" : "تغییر زبان به فارسی");
  });

  // منوهای زبان‌دار
  document.querySelectorAll(".lang-fa,.lang-en").forEach(el => el.style.display = "none");
  const showCls = curLang === "fa" ? ".lang-fa" : ".lang-en";
  document.querySelectorAll(showCls).forEach(el => el.style.display = "flex");
}

function initLanguage() {
  const saved = localStorage.getItem("lang");
  const browser = (navigator.language || "fa").slice(0,2);
  const initial = saved || (_langs.includes(browser) ? browser : "fa");
  _setDirByLang(initial);
  _updateLangButtonUI(initial);
}

function changeLanguageTo(newLang) {
  const target = _langs.includes(newLang) ? newLang : "fa";
  localStorage.setItem("lang", target);
  _setDirByLang(target);
  _updateLangButtonUI(target);

  // ریدایرکت ساده بین روت و /en/
  const onEN = location.pathname.startsWith("/en");
  if (target === "en" && !onEN) location.href = "/en/";
  if (target === "fa" && onEN)  location.href = "/";
}

/* ========== Theme (Emoji + Label) ========== */
function _updateThemeButtonText() {
  const lang = document.documentElement.lang || "fa";
  const labelText = lang === "en" ? "Change Theme" : "تغییر تم";
  document.querySelectorAll("#toggle-theme,.toggle-theme").forEach(btn => {
    // ساختار: [emoji][label]
    let emoji = btn.querySelector(".theme-emoji");
    let label = btn.querySelector(".theme-label");
    if (!emoji) { emoji = document.createElement("span"); emoji.className = "theme-emoji"; btn.prepend(emoji); }
    if (!label) { label = document.createElement("span"); label.className = "theme-label"; label.style.marginInlineStart = ".4rem"; btn.appendChild(label); }
    label.textContent = labelText;

    // ایموجی با توجه به تم
    const isDark = (document.documentElement.getAttribute("data-theme") || "light") === "dark";
    emoji.textContent = isDark ? "☀️" : "🌙";
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  _updateThemeButtonText();
  if (typeof updateShapes === "function") { try { updateShapes(); } catch(_){} }
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(cur === "dark" ? "light" : "dark");
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

/* ========== Startup glue ========== */
document.addEventListener("DOMContentLoaded", () => {
  // 1) هدر را لود کن
  loadHeader().then(() => {
    // 2) بعد از ورود هدر، زبان/تم را ست کن
    initLanguage();
    initTheme();

    // 3) بایند دکمه‌ها
    document.querySelectorAll("#lang-btn,.lang-button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute("data-lang") || (document.documentElement.lang === "fa" ? "en" : "fa");
        changeLanguageTo(targetLang);
      });
    });
    document.querySelectorAll("#toggle-theme,.toggle-theme").forEach(t => {
      t.addEventListener("click", (e) => { e.preventDefault(); toggleTheme(); });
    });
  });
});
