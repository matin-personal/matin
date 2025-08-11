// === script.js (نسخه اصلاح‌شده) ===

// توکن‌ها/پیکربندی یا متغیرهای کلی اینجا باشن
const supportedLangs = ['fa', 'en'];

// ----- توابع زبان -----
function updateLangButtonUI(lang) {
  // به‌روزرسانی همه دکمه‌های زبان (هم id و هم کلاس)
  const langEls = document.querySelectorAll('#lang-btn, .lang-button');
  langEls.forEach(btn => {
    try {
      // اگر تصویر داخل دکمه هست، مسیرش را هم آپدیت کن
      const img = btn.querySelector('img');
      if (img) {
        img.setAttribute('src', lang === 'fa' ? '/images/flag-usa.webp' : '/images/flag-iran.webp');
        img.setAttribute('alt', lang === 'fa' ? 'English' : 'فارسی');
      }
      btn.textContent = (lang === 'fa') ? 'English' : 'فارسی';
      // اگر تصویر داشتیم و می‌خواهیم متن + تصویر هر دو را نگه داریم، می‌توان کد متفاوتی قرار داد.
    } catch (e) {
      // از هر خطایی عبور کن — نباید اجرای اسکریپت را قطع کند
      console.warn('updateLangButtonUI error', e);
    }
  });
}

function initLanguage() {
  const savedLang = localStorage.getItem('lang');
  // مرورگر ممکن است 'fa-IR' یا 'en-US' و غیره برگرداند
  const browserLang = (navigator.language || navigator.userLanguage || 'fa').slice(0,2);
  const chosen = savedLang || (supportedLangs.includes(browserLang) ? browserLang : 'fa');

  document.documentElement.lang = chosen;
  document.documentElement.dir = chosen === 'fa' ? 'rtl' : 'ltr';
  updateLangButtonUI(chosen);

  // اگر هیچ زبانی ذخیره نشده و مرورگر غیر از fa است، فقط ذخیره کن — دیگر لزومی به ریدایرکت نداریم
  if (!savedLang) {
    localStorage.setItem('lang', chosen);
    // قبلاً کد ریدایرکت به /en/ داشتیم؛ این رفتار باعث ریدایرکت ناخواسته می‌شد.
    // اگر می‌خواهی خودکار به پوشه /en/ برویم، میتوانیم اینجا شرط بگذاریم.
  }
}

function changeLanguageTo(newLang) {
  if (!supportedLangs.includes(newLang)) return;
  localStorage.setItem('lang', newLang);
  // اگر سایت شما نسخه مجزا در /en/ دارد، این ریدایرکت انجام شود، در غیر این صورت فقط سمت کاربر تغییر جهت می‌یابد.
  if (newLang === 'en') {
    // اگر مسیر فعلی در /en/ نیست، ریدایرکت کن
    if (!location.pathname.startsWith('/en')) {
      location.href = '/en/';
      return;
    }
  } else {
    // فارسی
    if (location.pathname.startsWith('/en')) {
      // اگر نسخه انگلیسی هست و کاربر خواست فارسی بشه باید به ریشه بازگردد
      location.href = '/';
      return;
    }
  }

  // در صفحات single-page یا همان فایل‌های بدون ریدایرکت:
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  updateLangButtonUI(newLang);
}

// ----- توابع تم -----
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // اگر فانکشنی برای به‌روزرسانی اشکال پس‌زمینه دارید، فقط در صورت وجود اجرا شود
  if (typeof updateShapes === 'function') {
    try { updateShapes(); } catch (e) { console.warn('updateShapes() error', e); }
  }
  // به‌روزرسانی متن دکمه(ها)
  const toggles = document.querySelectorAll('#toggle-theme, .toggle-theme');
  toggles.forEach(btn => {
    if (btn) {
      btn.textContent = theme === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';
    }
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  applyTheme(saved);
}

// ----- بارگذاری فوتر (به‌صورت امن) -----
function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;
  fetch('/footer.html')
    .then(r => {
      if (!r.ok) throw new Error('footer load failed');
      return r.text();
    })
    .then(html => footerPlaceholder.innerHTML = html)
    .catch(err => {
      console.warn('Footer load failed:', err);
      // fallback: اگر لازم باشه میتونیم یک فوتر ساده درج کنیم
      // footerPlaceholder.innerHTML = '<footer>Designed by Matin</footer>';
    });
}

// ----- شروع اصلی بعد از DOMContentLoaded -----
document.addEventListener('DOMContentLoaded', function() {
  try {
    // init language & theme
    initLanguage();
    initTheme();

    // load footer
    loadFooter();

    // bind language buttons (ممکنه چند دکمه وجود داشته باشه)
    const langButtons = document.querySelectorAll('#lang-btn, .lang-button');
    if (langButtons && langButtons.length) {
      langButtons.forEach(btn => {
        btn.removeEventListener('click', onLangClickFallback);
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          // اگر دکمه دارای attribute ای برای زبان است، از آن استفاده کن
          const targetLang = btn.getAttribute('data-lang') || (document.documentElement.lang === 'fa' ? 'en' : 'fa');
          changeLanguageTo(targetLang);
        });
      });
    }

    // bind theme toggles (ممکنه چند دکمه وجود داشته باشه)
    const themeToggles = document.querySelectorAll('#toggle-theme, .toggle-theme');
    if (themeToggles && themeToggles.length) {
      themeToggles.forEach(t => {
        t.removeEventListener('click', toggleTheme);
        t.addEventListener('click', function(e) {
          e.preventDefault();
          toggleTheme();
        });
      });
    }

    // منوی همبرگر
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        const menu = document.getElementById('menuItems');
        if (menu) menu.classList.toggle('open');
      });
    }

    // به‌روزرسانی تاریخ فوتر اگر تابع وجود دارد
    if (typeof updateFooterDates === 'function') {
      try { updateFooterDates(); } catch (e) { /* ignore */ }
    }

    // تنظیم canvas بعد از resize
    const canvas = document.getElementById('background-canvas');
    if (canvas && canvas.getContext) {
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (typeof updateShapes === 'function') {
          try { updateShapes(); } catch (e) {}
        }
      }
      window.addEventListener('resize', resizeCanvas, { passive: true });
      resizeCanvas();
    }

  } catch (err) {
    console.error('Initialization error:', err);
  }
});

// یک fallback ساده (اگر نیاز به جدا کردن removeEventListener داشتیم)
function onLangClickFallback(e) {
  e.preventDefault();
  const current = document.documentElement.lang || 'fa';
  changeLanguageTo(current === 'fa' ? 'en' : 'fa');
}
