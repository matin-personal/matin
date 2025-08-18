// ================== script.js (drop-in) ==================
(function () {
  // --- Helper: ساخت کانواس پس‌زمینه اگر نبود
  function ensureBackgroundCanvas() {
    let c = document.getElementById('bg-shapes');
    if (!c) {
      c = document.createElement('canvas');
      c.id = 'bg-shapes';
      c.style.position = 'absolute';
      c.style.inset = '0';
      c.style.zIndex = '-1';
      c.style.pointerEvents = 'none';
      document.body.style.position = document.body.style.position || 'relative';
      document.body.prepend(c);
    }
  }

  // --- Helper: لود اسکریپت به‌صورت داینامیک و یک‌بار
  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="' + src + '"]')) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  // --- تاریخ‌ها در فوتر
  function updateFooterDates() {
    const now = new Date();
    const greg = now.getFullYear();
    const persian = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(now);
    const gy = document.getElementById('gregorian-year');
    const py = document.getElementById('persian-year');
    if (gy) gy.textContent = greg;
    if (py) py.textContent = persian;
  }

  // --- سوییچ زبان (در صفحات دکمه onclick="switchLang()" استفاده می‌شود)
  window.switchLang = function () {
    const current = document.documentElement.lang || 'fa';
    const next = current === 'fa' ? 'en' : 'fa';
    localStorage.setItem('lang', next);
    window.location.href = next === 'fa' ? '/' : '/en/';
  };

  // --- منوی موبایل (اگر در HTML از toggleMenu() استفاده شده)
  window.toggleMenu = function () {
    const menu = document.getElementById('menuItems');
    if (menu) menu.classList.toggle('open');
  };

  // --- تم
  function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('toggle-theme');
    if (btn) btn.textContent = saved === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';
  }

  function bindThemeToggle() {
    const btn = document.getElementById('toggle-theme');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.textContent = next === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';
      // اگر انیمیشن پس‌زمینه تابع نوسازی رنگ‌ها را اکسپورت کرده، صدا بزن
      if (typeof window.updateShapes === 'function') window.updateShapes();
    });
  }

  // --- لود فوتر به‌صورت Ajax (و سپس لود اسکریپت انیمیشن اگر لازم شد)
  function loadFooter() {
    const ph = document.getElementById('footer-placeholder');
    if (!ph) return Promise.resolve(); // صفحه‌ای که فوتر را درون‌ریزی نمی‌کند
    return fetch('/footer.html')
      .then(r => r.text())
      .then(html => {
        ph.innerHTML = html;
        // اسکریپت‌های داخل innerHTML اجرا نمی‌شوند؛ دستی لود می‌کنیم
        ensureBackgroundCanvas();
        return loadScriptOnce('/animated-shapes.js').catch(() => {});
      })
      .then(() => {
        updateFooterDates();
      })
      .catch(err => console.error('Error loading footer:', err));
  }

  // --- اگر کاربر صفحهٔ انگلیسی باشد و اولین ورود است، هدایت
  function initLangFromBrowser() {
    const saved = localStorage.getItem('lang');
    if (saved) return;
    const userLang = (navigator.language || navigator.userLanguage || 'fa').toLowerCase();
    if (userLang.startsWith('fa')) {
      localStorage.setItem('lang', 'fa');
    } else {
      localStorage.setItem('lang', 'en');
      // فقط اگر همین حالا روی مسیر فارسی هستیم، به en ببریم
      if (!location.pathname.startsWith('/en/')) {
        window.location.href = '/en/';
      }
    }
  }

  // --- شروع
  document.addEventListener('DOMContentLoaded', function () {
    initLangFromBrowser();
    initTheme();
    bindThemeToggle();
    // اگر جایی از صفحه خودت کانواس گذاشته‌ای، مشکلی نیست؛ اگر نبود ما می‌سازیم
    ensureBackgroundCanvas();

    // اگر animated-shapes از قبل داخل صفحه لود نشده، بعد از فوتر لودش می‌کنیم
    loadFooter().then(() => {
      if (!window.__bgShapesLoaded) {
        loadScriptOnce('/animated-shapes.js').then(() => {
          window.__bgShapesLoaded = true;
        }).catch(() => {});
      }
    });
  });
})();
```0
