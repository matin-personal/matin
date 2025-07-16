/*
function switchLang() {
  const currentPath = window.location.pathname;
  if (currentPath.startsWith("/fa")) {
    window.location.href = currentPath.replace("/fa", "/en");
  } else if (currentPath.startsWith("/en")) {
    window.location.href = currentPath.replace("/en", "/fa");
  } else {
    window.location.href = "/en/";
  }
}
function loadHeader() {
  fetch("/header.html")
    .then(res => res.text())
    .then(data => {
      const header = document.createElement("div");
      header.innerHTML = data;
      document.body.insertBefore(header, document.body.firstChild);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();

  const flag = document.getElementById("lang-flag");
  if (flag) {
    const path = window.location.pathname;
    if (path.startsWith("/fa")) {
      flag.src = "/images/flag-usa.png";
      flag.alt = "EN";
    } else {
      flag.src = "/images/flag-iran.png";
      flag.alt = "FA";
    }
  }
});
<script>
  const chatbotBtn = document.getElementById('chatbot-toggle');
  const chatbotBox = document.getElementById('chatbot-box');
  const messagesDiv = document.getElementById('chatbot-messages');

  chatbotBtn.addEventListener('click', () => {
    chatbotBox.style.display = chatbotBox.style.display === 'flex' ? 'none' : 'flex';
  });

  function chatbotSend() {
    const input = document.getElementById('chatbot-question');
    const msg = input.value.trim();
    if (msg === '') return;

    appendMessage("👤", msg);
    input.value = '';

    // پاسخ ساده چت‌بات (تو می‌تونی اینجا رو کامل‌تر کنی)
    let response = "متوجه نشدم. لطفاً واضح‌تر بپرس 😅";
    if (msg.includes("سلام")) response = "سلام دوست من! چطور می‌تونم کمکت کنم؟ 🤗";
    if (msg.includes("سایت")) response = "این سایت متعلق به متین محمدی هستش 🌐";
    if (msg.includes("طراحی")) response = "بله خدمات طراحی سایت هم ارائه میشه 🎨";

    setTimeout(() => {
      appendMessage("🤖", response);
    }, 500);
  }

  function appendMessage(sender, text) {
    const p = document.createElement('p');
    p.textContent = `${sender}: ${text}`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
</script>
<script src="bot-data.js"></script>
<script src="script.js"></script>
// Chatbot logic
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("chatbot-button");
  const box = document.getElementById("chatbot-box");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  button.onclick = () => {
    box.classList.toggle("hidden");
  };

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && input.value.trim()) {
      const userMsg = input.value.trim();
      showMessage("شما", userMsg);
      respondTo(userMsg);
      input.value = "";
    }
  });

  function showMessage(sender, text) {
    const msg = document.createElement("div");
    msg.textContent = `${sender}: ${text}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function respondTo(text) {
    let response = "متوجه نشدم. لطفاً واضح‌تر بپرسید.";
    if (text.includes("ساعت")) response = "من فعلاً ساعت رو نمی‌دونم 😅";
    if (text.includes("سلام")) response = "سلام! 👋 چطور می‌تونم کمک‌تون کنم؟";
    if (text.includes("طراحی سایت")) response = "بله! خدمات طراحی سایت هم ارائه می‌دیم.";

    setTimeout(() => showMessage("ربات", response), 500);
  }
});

*/
