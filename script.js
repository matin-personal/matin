// تنظیم زبان براساس URL
document.addEventListener("DOMContentLoaded", function () {
  const isEnglish = window.location.pathname.includes('/en/');
  const lang = isEnglish ? 'en' : 'fa';
  document.documentElement.lang = lang;

  // عنوان پویا بر اساس مسیر
  let pageTitle = '';
  if (window.location.pathname.includes('about')) {
    pageTitle = isEnglish ? 'About Us' : 'درباره ما';
  } else if (window.location.pathname.includes('contact')) {
    pageTitle = isEnglish ? 'Contact Us' : 'تماس با ما';
  } else {
    pageTitle = isEnglish ? 'Welcome to Our Website' : 'به وب‌سایت ما خوش آمدید';
  }
  document.title = pageTitle;

  // تغییر meta description و Open Graph
  const description = isEnglish
    ? "This is the English description for our website."
    : "این توضیحات فارسی برای وب‌سایت ما است.";
  const ogTitle = pageTitle;
  const ogDesc = description;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  const ogTitleTag = document.querySelector('meta[property="og:title"]');
  if (ogTitleTag) ogTitleTag.setAttribute('content', ogTitle);

  const ogDescTag = document.querySelector('meta[property="og:description"]');
  if (ogDescTag) ogDescTag.setAttribute('content', ogDesc);

  // دکمهٔ اسکرول به بالا
  const scrollTopBtn = document.getElementById("scroll-top");
  if (scrollTopBtn) {
    window.onscroll = function () {
      scrollTopBtn.style.display = window.scrollY > 100 ? "block" : "none";
    };

    scrollTopBtn.onclick = function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  // حالت شب با localStorage
  const toggleDark = document.getElementById("toggle-dark");
  if (toggleDark) {
    toggleDark.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });
  }

  // حفظ حالت شب بعد از لود مجدد
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});
// در script.js
function toggleLanguage() {
  const currentLang = document.documentElement.lang;
  const newLang = currentLang === 'fa' ? 'en' : 'fa';
  
  // تغییر جهت متن
  document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  
  // ریدایرکت به نسخه زبانی صحیح
  window.location.href = newLang === 'fa' 
    ? window.location.pathname.replace('/en/', '/fa/') 
    : window.location.pathname.replace('/fa/', '/en/');
}
// آپدیت متن دکمه بر اساس زبان
function updateThemeButton() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const isPersian = document.documentElement.lang === 'fa';
  
  btn.textContent = isPersian
    ? (isDark ? 'حالت روشن' : 'حالت تاریک')
    : (isDark ? 'Light Mode' : 'Dark Mode');
}
// تبدیل تاریخ
function updateFooterDates() {
  const now = new Date();
  
  // سال شمسی
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric'
  }).format(now);
  document.getElementById('persian-year').textContent = persianDate;
  
  // سال میلادی
  document.getElementById('gregorian-year').textContent = now.getFullYear();
}

// سیستم تم
function applyThemeSettings() {
  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
  updateFooterDates();
  applyThemeSettings();
  
  // تنظیم زبان اولیه
  if (!localStorage.getItem('lang')) {
    const userLang = navigator.language.startsWith('fa') ? 'fa' : 'en';
    localStorage.setItem('lang', userLang);
    document.documentElement.lang = userLang;
  }
});
