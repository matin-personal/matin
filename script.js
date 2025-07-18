// --- توابع عمومی ---
function toggleMenu() {
  const menu = document.getElementById("menuItems");
  menu.classList.toggle("open");
}

function openFullImage() {
  document.getElementById("imageModal").style.display = "block";
}

function closeFullImage() {
  document.getElementById("imageModal").style.display = "none";
}

// --- چت‌بات ---
document.addEventListener("DOMContentLoaded", () => {
  const chatbotBtn = document.getElementById("chatbot-button");
  const chatbotBox = document.getElementById("chatbot-box");
  const chatbotInput = document.getElementById("chatbot-input");
  const messagesDiv = document.getElementById("chatbot-messages");

  if (chatbotBtn) {
    chatbotBtn.addEventListener("click", () => {
      chatbotBox.classList.toggle("hidden");
    });

    chatbotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && chatbotInput.value.trim()) {
        const msg = chatbotInput.value.trim();
        appendMessage("شما", msg);
        chatbotInput.value = "";
        respondTo(msg);
      }
    });
  }

  function appendMessage(sender, text) {
    const p = document.createElement("div");
    p.textContent = `${sender}: ${text}`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function respondTo(text) {
    let response = "متوجه نشدم. لطفاً واضح‌تر بپرسید.";
    if (text.includes("سلام")) response = "سلام! 👋 چطور می‌تونم کمک‌تون کنم؟";
    if (text.includes("ساعت")) response = "من فعلاً ساعت رو نمی‌دونم 😅";
    if (text.includes("طراحی سایت")) response = "بله! خدمات طراحی سایت ارائه می‌دیم.";

    setTimeout(() => appendMessage("ربات", response), 500);
  }
});

// --- بارگذاری هدر و فوتر ---
function loadHeader() {
  fetch("/header.html")
    .then(res => {
      if (!res.ok) throw new Error("خطا در بارگذاری هدر");
      return res.text();
    })
    .then(data => {
      const header = document.createElement("div");
      header.innerHTML = data;
      document.body.insertBefore(header, document.body.firstChild);
    })
    .catch(err => console.error("خطا:", err));
}

window.addEventListener("DOMContentLoaded", () => {
  loadHeader();

  // بارگذاری فوتر
  fetch("/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
    .catch(err => console.error("خطا در لود فوتر:", err));
});
// ========================
// توابع اختصاصی صفحه تماس
// ========================
function initContactPage() {
  // بارگذاری منو و فوتر (اگر در صفحه تماس هستیم)
  if (document.body.classList.contains('page-contact')) {
    loadHeader();
    loadFooter();

    // تنظیمات particles.js (اختیاری)
    if (window.particlesJS) {
      particlesJS.load('particles-js', '/particles.json');
    }
  }
}

// اضافه کردن رویداد DOMContentLoaded
document.addEventListener("DOMContentLoaded", initContactPage);
// ========================
// English Version Functions
// ========================
function initEnglishPages() {
  if (document.documentElement.lang !== 'en') return;

  // Load footer for all English pages
  loadFooter();

  // Contact page specific
  if (document.body.classList.contains('page-en-contact')) {
    // Additional contact page scripts if needed
  }

  // Index page specific
  if (document.body.classList.contains('page-en-index')) {
    // Additional index page scripts
  }
}

// Add to existing DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  initEnglishPages();
});
window.onerror = function(message, source, lineno) {
  console.error(`خطا: ${message} در ${source}:${lineno}`);
};
// سیستم تم
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
  }
}

// سیستم زبان
function initLanguage() {
  const savedLang = localStorage.getItem('lang');
  const browserLang = navigator.language.startsWith('fa') ? 'fa' : 'en';
  const defaultLang = savedLang || browserLang;
  
  document.documentElement.lang = defaultLang;
  document.documentElement.dir = defaultLang === 'fa' ? 'rtl' : 'ltr';
  updateLangButton();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function toggleLanguage() {
  const currentLang = document.documentElement.lang;
  const newLang = currentLang === 'fa' ? 'en' : 'fa';
  
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  localStorage.setItem('lang', newLang);
  
  // ریدایرکت به صفحه معادل در زبان دیگر
  const path = window.location.pathname;
  const newPath = newLang === 'fa' 
    ? path.replace('/en/', '/fa/') 
    : path.replace('/fa/', '/en/');
  
  window.location.pathname = newPath || `/${newLang}/`;
}

function updateLangButton() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  
  const isPersian = document.documentElement.lang === 'fa';
  btn.innerHTML = isPersian 
    ? '<img src="/images/flag-usa.png" alt="EN" width="20"> English' 
    : '<img src="/images/flag-iran.png" alt="FA" width="20"> فارسی';
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  
  // اضافه کردن دکمه‌ها
  const controlDiv = document.createElement('div');
  controlDiv.className = 'control-buttons';
  controlDiv.innerHTML = `
    <button class="theme-toggle" onclick="toggleTheme()">
      🌓 ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark'}
    </button>
    <button class="lang-toggle" id="lang-toggle" onclick="toggleLanguage()"></button>
  `;
  document.body.prepend(controlDiv);
  
  updateLangButton();
});
