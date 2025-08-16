// === script.js (Modified) ===
// This modified version addresses two issues:
// 1. Removing duplicate language labels by stripping existing text nodes from
//    language buttons before injecting flag and label elements.
// 2. Localizing the theme toggle button text based on the current document
//    language (Persian or English).

const supportedLangs = ['fa', 'en'];

/* ---------- ط²ط¨ط§ظ† ---------- */
// Ensure the language button has exactly one flag and one label, and remove
// any stray text nodes that could lead to duplicate labels.
function ensureLangBtnParts(btn) {
  // Remove any text nodes to avoid duplicate language labels.
  btn.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.remove();
    }
  });
  let img = btn.querySelector('img#lang-flag');
  if (!img) {
    img = document.createElement('img');
    img.id = 'lang-flag';
    img.style.width = '24px';
    img.style.height = '24px';
    img.style.borderRadius = '50%';
    img.style.boxShadow = '0 0 4px rgba(0,0,0,.25)';
    btn.prepend(img);
  }
  let label = btn.querySelector('span');
  if (!label) {
    label = document.createElement('span');
    label.style.marginInlineStart = '.5rem';
    btn.appendChild(label);
  }
  return { img, label };
}

function updateLangButtonUI(currentLang) {
  const langEls = document.querySelectorAll('#lang-btn, .lang-button');
  langEls.forEach(btn => {
    try {
      const targetLang = (currentLang === 'fa') ? 'en' : 'fa';
      const { img, label } = ensureLangBtnParts(btn);
      // Absolute paths ensure correct behavior on both '/' and '/en/'.
      img.setAttribute('src', targetLang === 'en' ? '/images/flag-usa.webp' : '/images/flag-iran.webp');
      img.setAttribute('alt', targetLang === 'en' ? 'English' : 'ظپط§ط±ط³غŒ');
      label.textContent = (targetLang === 'en') ? 'English' : 'ظپط§ط±ط³غŒ';
      btn.setAttribute('data-lang', targetLang);
    } catch (e) {
      console.warn('updateLangButtonUI error', e);
    }
  });
}

function initLanguage() {
  const savedLang   = localStorage.getItem('lang');
  const browserLang = (navigator.language || navigator.userLanguage || 'fa').slice(0,2);
  const initial     = savedLang || (supportedLangs.includes(browserLang) ? browserLang : 'fa');
  document.documentElement.lang = initial;
  document.documentElement.dir  = (initial === 'fa') ? 'rtl' : 'ltr';
  updateLangButtonUI(initial);
  if (!savedLang) {
    localStorage.setItem('lang', initial);
    if (initial === 'en' && !location.pathname.startsWith('/en')) { location.href = '/en/'; return; }
    if (initial === 'fa' &&  location.pathname.startsWith('/en')) { location.href = '/';    return; }
  }
}

function changeLanguageTo(newLang) {
  const target = supportedLangs.includes(newLang) ? newLang : 'fa';
  localStorage.setItem('lang', target);
  if (target === 'en') {
    if (!location.pathname.startsWith('/en')) { location.href = '/en/'; return; }
  } else {
    if (location.pathname.startsWith('/en'))   { location.href = '/';    return; }
  }
  document.documentElement.lang = target;
  document.documentElement.dir  = (target === 'fa') ? 'rtl' : 'ltr';
  updateLangButtonUI(target);
}

/* ---------- طھظ… ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Determine language to choose appropriate label for theme button.
  const lang   = document.documentElement.lang || 'fa';
  const textFa = ' طھط؛غŒغŒط± طھظ…';
  const textEn = 'Change Theme';
  document.querySelectorAll('#toggle-theme, .toggle-theme')
    .forEach(btn => btn.textContent = (lang === 'fa') ? textFa : textEn);
  if (typeof updateShapes === 'function') {
    try { updateShapes(); } catch (_) {}
  }
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
function initTheme() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('theme');
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

/* ---------- ظپظˆطھط± ط¯ط§غŒظ†ط§ظ…غŒع© ط¨ط§ ع©ط´â€Œط´ع©ظ† ---------- */
function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;
  fetch('/footer.html?v=20250814') // update the version when footer changes
    .then(r => { if (!r.ok) throw new Error('footer load failed'); return r.text(); })
    .then(html => footerPlaceholder.innerHTML = html)
    .catch(err => console.warn('Footer load failed:', err));
}

/* ---------- ط¯ط±ط§ظˆط± ظ…ظ†ظˆ ---------- */
function initDrawer() {
  const btn      = document.querySelector('.hamburger');
  const drawer   = document.getElementById('sideDrawer');
  const closeBtn = drawer ? drawer.querySelector('.drawer-close') : null;
  const backdrop = document.getElementById('drawerBackdrop');
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    backdrop && backdrop.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop && backdrop.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
  }
  btn      && btn.addEventListener('click', openDrawer);
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop && backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
}

/* ---------- ط§ط³طھط§ط±طھط§ظ¾ ---------- */
document.addEventListener('DOMContentLoaded', function() {
  try {
    initLanguage();
    initTheme();
    loadFooter();
    // Bind language button
    document.querySelectorAll('#lang-btn, .lang-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang') || ((document.documentElement.lang === 'fa') ? 'en' : 'fa');
        changeLanguageTo(targetLang);
      });
    });
    // Bind theme button
    document.querySelectorAll('#toggle-theme, .toggle-theme').forEach(t => {
      t.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });
    });
    initDrawer();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
