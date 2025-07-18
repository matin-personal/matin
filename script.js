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
