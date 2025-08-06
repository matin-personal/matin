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

  // لود فوتر
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('/footer.html')
      .then(response => response.text())
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(error => console.error('Error loading footer:', error));
  }

  // دکمه تغییر تم
  document.getElementById('toggle-theme').addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.textContent = newTheme === 'dark' ? '🌞 تغییر تم' : '🌙 تغییر تم';
    updateShapes(); // به‌روزرسانی اشکال با تم جدید
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

  // تنظیم Canvas برای پس‌زمینه پویا
  const canvas = document.getElementById('background-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let shapes = [];
  const maxShapes = 10;

  // اشکال و رنگ‌ها
  const shapesList = ['circle', 'square', 'triangle'];
  const getRandomColor = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const lightColors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
    const darkColors = ['#ffeb3b', '#ff9800', '#f44336'];
    return theme === 'dark' ? darkColors[Math.floor(Math.random() * darkColors.length)] : lightColors[Math.floor(Math.random() * lightColors.length)];
  };

  // کلاس Shape
  class Shape {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 30 + 10;
      this.shape = shapesList[Math.floor(Math.random() * shapesList.length)];
      this.color = getRandomColor();
      this.speedX = (Math.random() - 0.5) * 4;
      this.speedY = (Math.random() - 0.5) * 4;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      if (this.shape === 'circle') {
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      } else if (this.shape === 'square') {
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      } else if (this.shape === 'triangle') {
        ctx.moveTo(this.x, this.y - this.size / 2);
        ctx.lineTo(this.x - this.size / 2, this.y +
