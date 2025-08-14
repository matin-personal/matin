// animated-shapes.js — نسخه‌ی تمیز و یکپارچه

// ابتدا تلاش می‌کنیم کانواس جدید را پیدا کنیم؛ اگر نبود، از نام قدیمی استفاده می‌کنیم.
let canvas = document.getElementById("background-canvas");
if (!canvas) canvas = document.getElementById("bg-shapes");
if (!canvas) {
  console.warn('No canvas with id="background-canvas" or "bg-shapes" found.');
} else {
  const ctx = canvas.getContext("2d");

  // تنظیم اندازه
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  // داده‌های شکل‌ها
  let shapes = [];
  const maxShapes = 10;
  const shapeTypes = ["circle", "square", "triangle"];

  function randomColor(darkMode) {
    const base = darkMode ? 150 : 0;
    const range = darkMode ? 100 : 80;
    return `rgb(${base + Math.random() * range}, ${base + Math.random() * range}, ${base + Math.random() * range})`;
  }

  function createShape(x, y) {
    const darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const size = 10 + Math.random() * 30;
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;
    return { x, y, dx, dy, size, color: randomColor(darkMode), type };
  }

  function drawShape(s) {
    ctx.fillStyle = s.color;
    ctx.beginPath();
    if (s.type === "circle") {
      ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.type === "square") {
      ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
    } else if (s.type === "triangle") {
      ctx.moveTo(s.x, s.y - s.size / 2);
      ctx.lineTo(s.x - s.size / 2, s.y + s.size / 2);
      ctx.lineTo(s.x + s.size / 2, s.y + s.size / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(s => {
      s.x += s.dx;
      s.y += s.dy;

      // برخورد با مرزها + کمی تنوع
      if (s.x <= 0 || s.x >= canvas.width) s.dx *= -1;
      if (s.y <= 0 || s.y >= canvas.height) s.dy *= -1;

      if (Math.random() < 0.02) s.color = randomColor(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (Math.random() < 0.01) s.size = 10 + Math.random() * 30;
      if (Math.random() < 0.01) s.type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

      drawShape(s);
    });
    requestAnimationFrame(animate);
  }

  // کلیک برای افزودن شکل
  canvas.addEventListener("click", (e) => {
    if (shapes.length >= maxShapes) shapes.shift();
    shapes.push(createShape(e.clientX, e.clientY));
  });

  // چند شکل اولیه
  for (let i = 0; i < 6; i++) {
    shapes.push(createShape(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  animate();
}
