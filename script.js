document.addEventListener("DOMContentLoaded", function() {
  // تنظیم تم اولیه
  const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  // دکمه تغییر تم
  document.getElementById('toggle-theme')?.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.textContent = newTheme === 'dark' ? '🌞' : '🌙';
  });

  // سیستم چندزبانی بهبود یافته
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      const currentLang = document.documentElement.lang;
      const newLang = currentLang === 'fa' ? 'en' : 'fa';
      localStorage.setItem('lang', newLang);
      window.location.href = newLang === 'fa' ? '/' : '/en/';
    });
  }

  // اسکرول به بالا
  window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
      scrollBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
    }
  });

  // تاریخ در فوتر
  updateFooterDates();
});

function updateFooterDates() {
  const now = new Date();
  
  // سال شمسی
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric'
  }).format(now);
  document.getElementById('persian-year')?.textContent = persianDate;
  
  // سال میلادی
  document.getElementById('gregorian-year')?.textContent = now.getFullYear();
}
