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
