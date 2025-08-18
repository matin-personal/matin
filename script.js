// /script.js
document.addEventListener('DOMContentLoaded', () => {
  // تم اولیه
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  // دکمهٔ تم (اگر وجود داشته باشد)
  const themeBtn = document.getElementById('toggle-theme');
  if (themeBtn) {
    themeBtn.textContent = savedTheme === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeBtn.textContent = next === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';
      // به پس‌زمینه خبر بده رنگ‌ها رو تازه کنه
      if (window.updateBgShapesTheme) window.updateBgShapesTheme(next);
    });
  }

  // زبان
  const userLang = navigator.language || navigator.userLanguage || 'fa';
  const savedLang = localStorage.getItem('lang');
  if (!savedLang) {
    localStorage.setItem('lang', userLang.startsWith('fa') ? 'fa' : 'en');
    if (!userLang.startsWith('fa')) window.location.href = '/en/';
  }

  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = document.documentElement.lang || 'fa';
      const next = current === 'fa' ? 'en' : 'fa';
      localStorage.setItem('lang', next);
      window.location.href = next === 'fa' ? '/' : '/en/';
    });
  }

  // فوتر
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('/footer.html')
      .then(r => r.text())
      .then(html => {
        footerPlaceholder.innerHTML = html;
        updateFooterDates();
        // چون فوتر با fetch تزریق میشه، اسکریپت‌هاش اجرا نمیشن.
        // پس اینجا اسکریپت پس‌زمینه رو بارگذاری می‌کنیم:
        if (!document.querySelector('script[src$="animated-shapes.js"]')) {
          const s = document.createElement('script');
          s.src = '/animated-shapes.js';
          s.defer = true;
          document.body.appendChild(s);
        }
      })
      .catch(err => console.error('Error loading footer:', err));
  } else {
    // اگر فوتر placeholder نبود هم اسکریپت پس‌زمینه رو بارگذاری کن
    if (!document.querySelector('script[src$="animated-shapes.js"]')) {
      const s = document.createElement('script');
      s.src = '/animated-shapes.js';
      s.defer = true;
      document.body.appendChild(s);
    }
  }
});

// تاریخ‌ها در فوتر
function updateFooterDates() {
  try {
    const now = new Date();
    const g = document.getElementById('gregorian-year');
    if (g) g.textContent = now.getFullYear();
    const fa = document.getElementById('persian-year');
    if (fa) fa.textContent = new Intl.DateTimeFormat('fa-IR', { calendar: 'persian', year: 'numeric' }).format(now);
  } catch (_) {}
}
