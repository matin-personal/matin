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
