// === script.js (نسخه نهایی) ===

// پیکربندی پایه
const supportedLangs = ['fa', 'en'];

/* ---------------- زبان ---------------- */

// دکمهٔ زبان باید «زبان مقصد» را نشان بدهد (برعکس زبان فعلی صفحه)
function updateLangButtonUI(currentLang) {
  const langEls = document.querySelectorAll('#lang-btn, .lang-button');
  langEls.forEach(btn => {
    try {
      const targetLang = (currentLang === 'fa') ? 'en' : 'fa'; // مقصد
      const img   = btn.querySelector('img#lang-flag');
      const label = btn.querySelector('span') || btn;

      if (img) {
        img.setAttribute('src', targetLang === 'en' ? '/images/flag-usa.webp' : '/images/flag-iran.webp');
        img.setAttribute('alt', targetLang === 'en' ? 'English' : 'فارسی');
      }
      if (label) {
        label.textContent = (targetLang === 'en') ? 'English' : 'فارسی';
      }

      // برای کلیک بعدی، مقصد را به‌صورت صریح نگه می‌داریم
      btn.setAttribute('data-lang', targetLang);
    } catch (e) {
      console.warn('updateLangButtonUI error', e);
    }
  });
}

function initLanguage() {
  const savedLang   = localStorage.getItem('lang');
  const browserLang = (navigator.language || navigator.userLanguage || 'fa').slice(0, 2);
  const initial     = savedLang || (supportedLangs.includes(browserLang) ? browserLang : 'fa');

  // اعمال زبان و جهت
  document.documentElement.lang = initial;
  document.documentElement.dir  = (initial === 'fa') ? 'rtl' : 'ltr';
  updateLangButtonUI(initial);

  // فقط بار اول: ذخیره و هدایت به مسیر درست اگر نسخه‌های جداگانه داری
  if (!savedLang) {
    localStorage.setItem('lang', initial);

    // اگر زبان دستگاه EN بود و در /en/ نیستیم → برو /en/
    if (initial === 'en' && !location.pathname.startsWith('/en')) {
      location.href = '/en/';
      return;
    }
    // اگر زبان دستگاه FA بود و در /en/ هستیم → برو ریشه
    if (initial === 'fa' && location.pathname.startsWith('/en')) {
      location.href = '/';
      return;
    }
  }
}

function changeLanguageTo(newLang) {
  const target = supportedLangs.includes(newLang) ? newLang : 'fa';
  localStorage.setItem('lang', target);

  // اگر ساختار دو-شاخه داری، ریدایرکت کن
  if (target === 'en') {
    if (!location.pathname.startsWith('/en')) {
      location.href = '/en/';
      return;
    }
  } else { // fa
    if (location.pathname.startsWith('/en')) {
      location.href = '/';
      return;
    }
  }

  // در صفحات تک‌فایله (بدون ریدایرکت)
  document.documentElement.lang = target;
  document.documentElement.dir  = (target === 'fa') ? 'rtl' : 'ltr';
  updateLangButtonUI(target);
}

/* ---------------- تم (روشن/تاریک) ---------------- */

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  // به‌روزرسانی متن دکمه‌های تم (اگر چند دکمه وجود دارد)
  const toggles = document.querySelectorAll('#toggle-theme, .toggle-theme');
  toggles.forEach(btn => {
    if (btn) btn.textContent = (theme === 'dark') ? '🌞 تغییر تم' : '🌙 تغییر تم';
  });

  // اگر جایی تابع updateShapes دارید، فقط در صورت وجود اجرا شود
  if (typeof updateShapes === 'function') {
    try { updateShapes(); } catch (e) { console.warn('updateShapes() error', e); }
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved       = localStorage.getItem('theme'); // 'light' | 'dark' | null
  const theme       = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

/* ---------------- فوتر داینامیک ---------------- */

function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;
  fetch('/footer.html?cb=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error('footer load failed');
      return r.text();
    })
    .then(html => footerPlaceholder.innerHTML = html)
    .catch(err => console.warn('Footer load failed:', err));
}

/* ---------------- دراور منو ---------------- */

function initDrawer(){
  const btn      = document.querySelector('.hamburger');
  const drawer   = document.getElementById('sideDrawer');
  const closeBtn = drawer ? drawer.querySelector('.drawer-close') : null;
  const backdrop = document.getElementById('drawerBackdrop');

  function openDrawer(){
    if (!drawer) return;
    drawer.classList.add('open');
    backdrop && backdrop.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer(){
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop && backdrop.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
  }

  btn      && btn.addEventListener('click', openDrawer);
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop && backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeDrawer(); });
}

/* ---------------- استارتاپ ---------------- */

document.addEventListener('DOMContentLoaded', function() {
  try {
    // زبان و تم (بار اول از دستگاه، بعداً از localStorage)
    initLanguage();
    initTheme();

    // فوتر
    loadFooter();

    // بایند دکمه زبان (همه دکمه‌ها، اگر چندتا باشند)
    const langButtons = document.querySelectorAll('#lang-btn, .lang-button');
    if (langButtons && langButtons.length) {
      langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetLang = btn.getAttribute('data-lang') || ((document.documentElement.lang === 'fa') ? 'en' : 'fa');
          changeLanguageTo(targetLang);
        });
      });
    }

    // بایند دکمه‌های تم
    const themeToggles = document.querySelectorAll('#toggle-theme, .toggle-theme');
    if (themeToggles && themeToggles.length) {
      themeToggles.forEach(t => {
        t.addEventListener('click', (e) => {
          e.preventDefault();
          toggleTheme();
        });
      });
    }

    // منوی کشویی
    initDrawer();

  } catch (err) {
    console.error('Initialization error:', err);
  }
});
