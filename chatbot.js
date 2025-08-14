// chatbot.js
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const chatbox = document.getElementById('chatbot-box');
  const input = document.getElementById('chatbot-question');
  const messages = document.getElementById('chatbot-messages');

  // باز و بسته کردن پنجره
  toggleBtn.addEventListener('click', () => {
    chatbox.classList.toggle('open');
    // هر بار باز شدن، اسکرول را به پایین می‌بریم
    if (chatbox.classList.contains('open')) {
      messages.scrollTop = messages.scrollHeight;
    }
  });

  // ارسال پیام با دکمه یا کلید Enter
  window.chatbotSend = function() {
    const text = input.value.trim();
    if (!text) return;
    appendMessage('user', text);
    input.value = '';

    const lang = document.documentElement.lang || 'fa';
    // پاسخ در botResponses تعریف شده است؛ اگر نبود، پیام پیش‌فرض
    let reply = botResponses[text];
    if (!reply) {
      reply = lang === 'fa'
        ? 'متوجه نشدم، لطفاً سوال را واضح‌تر بنویسید.'
        : 'I didn’t quite get that, could you rephrase?';
    }
    setTimeout(() => appendMessage('bot', reply), 400);
  };

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      window.chatbotSend();
    }
  });

  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.textContent = text;
    messages.appendChild(div);
    // اسکرول به آخر
    messages.scrollTop = messages.scrollHeight;
  }
});
