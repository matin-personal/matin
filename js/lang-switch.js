const supportedLangs = ['fa', 'en'];
const userLang = navigator.language.slice(0, 2);
const savedLang = localStorage.getItem('lang');

if (!savedLang && supportedLangs.includes(userLang)) {
  if (userLang === 'en') window.location.href = '/en/';
  else if (userLang === 'fa') window.location.href = '/';
}
function switchLang() {
  const current = localStorage.getItem('lang') || navigator.language.slice(0, 2);

  if (current === 'fa') {
    localStorage.setItem('lang', 'en');
    window.location.href = '/en/';
  } else {
    localStorage.setItem('lang', 'fa');
    window.location.href = '/';
  }
}

// تغییر متن دکمه براساس زبان فعلی
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('lang-btn');
  if (btn) {
    const current = localStorage.getItem('lang') || navigator.language.slice(0, 2);
    btn.innerText = current === 'fa' ? 'English' : 'فارسی';
  }
});
