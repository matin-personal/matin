document.addEventListener("DOMContentLoaded", function() {
  // تنظیم تم اولیه بر اساس تنظیمات دستگاه
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('toggle-theme').textContent = savedTheme === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';

  // تنظیم زبان اولیه بر اساس تنظیمات مرورگر
  const userLang = navigator.language || navigator.userLanguage;
  const savedLang = localStorage.getItem('lang');
  if (!savedLang) {
    if (userLang.startsWith('fa')) {
      localStorage.setItem('lang', 'fa');
    } else {
      localStorage.setItem('lang', 'en');
      window.location.href = '/en/';
    }
  }

  // دکمه تغییر تم
  document.getElementById('toggle-theme').addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.textContent = newTheme === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';
  });

  // دکمه تغییر زبان
  document.getElementById('lang-btn').addEventListener('click', function() {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'fa' ? 'en' : 'fa';
    localStorage.setItem('lang', newLang);
    window.location.href = newLang === 'fa' ? '/' : '/en/';
  });

  // به‌روزرسانی تاریخ در فوتر
  updateFooterDates();
});

function updateFooterDates() {
  const now = new Date();
  document.getElementById('persian-year').textContent = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(now);
  document.getElementById('gregorian-year').textContent = now.getFullYear();
}
