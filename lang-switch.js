const supportedLangs = ['fa', 'en'];

function initLanguage() {
  const savedLang = localStorage.getItem('lang');
  const browserLang = navigator.languages?.find(lang => supportedLangs.includes(lang.slice(0, 2)))?.slice(0, 2) || 'fa';
  const currentLang = savedLang || browserLang;
  
  document.documentElement.lang = currentLang;
  updateLangButton(currentLang);
}

function switchLang() {
  const current = document.documentElement.lang;
  const newLang = current === 'fa' ? 'en' : 'fa';
  
  localStorage.setItem('lang', newLang);
  document.documentElement.lang = newLang;
  updateLangButton(newLang);
  
  // تغییر جهت متن
  document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
}

function updateLangButton(lang) {
  const btn = document.getElementById('lang-btn');
  if (btn) {
    btn.textContent = lang === 'fa' ? 'English' : 'فارسی';
    btn.querySelector('img')?.setAttribute('src', 
      lang === 'fa' ? '/images/flag-usa.png' : '/images/flag-iran.png');
  }
}

document.addEventListener('DOMContentLoaded', initLanguage);
