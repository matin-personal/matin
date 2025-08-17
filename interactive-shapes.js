// interactive-shapes.js

// تابع اصلی که همه منطق را اجرا می‌کند
function initShapes(canvas) {
  const MAX_SHAPES = 8;
  const palette = [
    { light: "#FFB74D", dark: "#EF6C00" },
    { light: "#64B5F6", dark: "#1565C0" },
    { light: "#81C784", dark: "#2E7D32" },
    { light: "#BA68C8", dark: "#6A1B9A" },
    { light: "#E57373", dark: "#C62828" },
    { light: "#4DD0E1", dark: "#00838F" },
    { light: "#FFD54F", dark: "#FFA000" },
    { light: "#90A4AE", dark: "#455A64" },
    { light: "#F06292", dark: "#AD1457" },
    { light: "#A1887F", dark: "#5D4037" },
    { light: "#7986CB", dark: "#283593" },
    { light: "#4DB6AC", dark: "#00796B" },
    { light: "#FF8A65", dark: "#D84315" },
    { light: "#81D4FA", dark: "#0277BD" },
    { light: "#AED581", dark: "#33691E" },
    { light: "#E0E0E0", dark: "#424242" },
    { light: "#FFE082", dark: "#FF6F00" },
    { light: "#B0BEC5", dark: "#37474F" },
    { light: "#F48FB1", dark: "#880E4F" },
    { light: "#CE93D8", dark: "#6A1B9A" },
    { light: "#B39DDB", dark: "#512DA8" },
    { light: "#80CBC4", dark: "#004D40" },
    { light: "#DCE775", dark: "#558B2F" },
    { light: "#FFAB91", dark: "#BF360C" },
    { light: "#9CCC65", dark: "#558B2F" }
  ];

  // تابع کمکی: رنگ HEX را به RGB تبدیل می‌کند
  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  // انتخاب رنگ بر اساس تم
  function pickRandomColor(theme) {
    const p = palette[Math.floor(Math.random() * palette.length)];
    const color = theme === "dark" ? p.light : p.dark;
    const [r, g, b] = hexToRgb(color);
    return `rgba(${r},${g},${b},0.25)`;
  }

  // تعریف شکل تصادفی (چندضلعی یا ستاره)
  function generateRandomShapeDef() {
    if (Math.random() < 0.5) {
      const sides = 3 + Math.floor(Math.random() * 8);
      return { type: "polygon", sides };
    } else {
      const points = 5 + Math.floor(Math.random() * 8);
      const innerRatio = 0.4 + Math.random() * 0.3;
      return { type: "star", points, innerRatio };
    }
  }

  const ctx = canvas.getContext("2d");
  let shapes = [];
  let currentTheme = document.documentElement.getAttribute("data-theme") || "light";

  // تولید شکل جدید
  function createShape() {
    const size = 40 + Math.random() * 40;
    const speed = 0.5 + Math.random() * 1.5;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      size,
      color: pickRandomColor(currentTheme),
      def: generateRandomShapeDef()
    };
  }

  function randomizeShapeProperties(shape) {
    shape.def = generateRandomShapeDef();
    shape.color = pickRandomColor(currentTheme);
    const speed = Math.sqrt(shape.dx * shape.dx + shape.dy * shape.dy) || 1;
    const angle = Math.random() * Math.PI * 2;
    shape.dx = Math.cos(angle) * speed;
    shape.dy = Math.sin(angle) * speed;
  }

  function drawShape(shape) {
    ctx.fillStyle = shape.color;
    ctx.beginPath();
    if (shape.def.type === "polygon") {
      const sides = shape.def.sides;
      const step = (Math.PI * 2) / sides;
      const radius = shape.size / 2;
      for (let i = 0; i < sides; i++) {
        const angle = i * step;
        const px = shape.x + Math.cos(angle) * radius;
        const py = shape.y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (shape.def.type === "star") {
      const points = shape.def.points;
      const innerRatio = shape.def.innerRatio;
      const step = Math.PI / points;
      const outer = shape.size / 2;
      const inner = outer * innerRatio;
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = i * step;
        const px = shape.x + Math.cos(angle) * radius;
        const py = shape.y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
      shape.x += shape.dx;
      shape.y += shape.dy;
      let hitEdge = false;
      if (shape.x - shape.size / 2 < 0 || shape.x + shape.size / 2 > canvas.width) {
        shape.dx *= -1;
        hitEdge = true;
      }
      if (shape.y - shape.size / 2 < 0 || shape.y + shape.size / 2 > canvas.height) {
        shape.dy *= -1;
        hitEdge = true;
      }
      if (hitEdge) randomizeShapeProperties(shape);
      drawShape(shape);
    });
    requestAnimationFrame(animate);
  }

  // تغییر رنگ اشکال هنگام تغییر تم
  function updateShapes() {
    currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    shapes.forEach((shape) => {
      shape.color = pickRandomColor(currentTheme);
    });
  }
  window.updateShapes = updateShapes;

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let hit = false;
    shapes.forEach((shape) => {
      const dist = Math.sqrt((mx - shape.x) ** 2 + (my - shape.y) ** 2);
      if (dist <= shape.size / 2) {
        randomizeShapeProperties(shape);
        hit = true;
      }
    });
    if (!hit && shapes.length > 0) {
      randomizeShapeProperties(shapes[Math.floor(Math.random() * shapes.length)]);
    }
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  shapes = [];
  for (let i = 0; i < MAX_SHAPES; i++) {
    shapes.push(createShape());
  }
  animate();
}

// انتظار برای آماده شدن DOM و پیدا کردن کانواس
document.addEventListener("DOMContentLoaded", function () {
  function waitForCanvas() {
    const canvas = document.getElementById("background-canvas");
    if (canvas) {
      initShapes(canvas);
    } else {
      setTimeout(waitForCanvas, 100);
    }
  }
  waitForCanvas();
});
