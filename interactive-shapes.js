// interactive-shapes.js

(() => {
  // ----- تنظیمات اصلی -----
  const MAX_SHAPES = 8; // حداکثر تعداد اشکال همزمان (کمتر از 10)
  const palette = [
    { light: "#FFB74D", dark: "#EF6C00" }, // orange
    { light: "#64B5F6", dark: "#1565C0" }, // blue
    { light: "#81C784", dark: "#2E7D32" }, // green
    { light: "#BA68C8", dark: "#6A1B9A" }, // purple
    { light: "#E57373", dark: "#C62828" }, // red
    { light: "#4DD0E1", dark: "#00838F" }, // cyan
    { light: "#FFD54F", dark: "#FFA000" }, // yellow
    { light: "#90A4AE", dark: "#455A64" }, // blue grey
    { light: "#F06292", dark: "#AD1457" }, // pink
    { light: "#A1887F", dark: "#5D4037" }, // brown
    { light: "#7986CB", dark: "#283593" }, // indigo
    { light: "#4DB6AC", dark: "#00796B" }, // teal
    { light: "#FF8A65", dark: "#D84315" }, // deep orange
    { light: "#81D4FA", dark: "#0277BD" }, // light blue
    { light: "#AED581", dark: "#33691E" }, // light green
    { light: "#E0E0E0", dark: "#424242" }, // grey
    { light: "#FFE082", dark: "#FF6F00" }, // amber
    { light: "#B0BEC5", dark: "#37474F" }, // blue grey
    { light: "#F48FB1", dark: "#880E4F" }, // rose
    { light: "#CE93D8", dark: "#6A1B9A" }, // mauve
    { light: "#B39DDB", dark: "#512DA8" }, // deep purple
    { light: "#80CBC4", dark: "#004D40" }, // mint
    { light: "#DCE775", dark: "#558B2F" }, // lime
    { light: "#FFAB91", dark: "#BF360C" }, // salmon
    { light: "#9CCC65", dark: "#558B2F" }  // olive
  ];

  // ----- ابزارهای کمکی -----
  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  function pickRandomColor(theme) {
    const p = palette[Math.floor(Math.random() * palette.length)];
    const color = theme === "dark" ? p.light : p.dark;
    const [r, g, b] = hexToRgb(color);
    return `rgba(${r},${g},${b},0.25)`; // شفافیت 0.25 برای مزاحم نبودن
  }

  function generateRandomShapeDef() {
    // یک شکل تصادفی می‌سازد: چندضلعی یا ستاره
    if (Math.random() < 0.5) {
      // چندضلعی منتظم با 3 تا 10 ضلع
      const sides = 3 + Math.floor(Math.random() * 8);
      return { type: "polygon", sides };
    } else {
      // ستاره با 5 تا 12 پر و نسبت شعاع داخلی
      const points = 5 + Math.floor(Math.random() * 8);
      const innerRatio = 0.4 + Math.random() * 0.3;
      return { type: "star", points, innerRatio };
    }
  }

  // ----- متغیرهای اصلی -----
  const canvas = document.getElementById("background-canvas");
  if (!canvas) return; // اگر کانواس موجود نباشد
  const ctx = canvas.getContext("2d");
  let shapes = [];
  let currentTheme = document.documentElement.getAttribute("data-theme") || "light";

  // ----- ایجاد شکل جدید -----
  function createShape() {
    const size = 40 + Math.random() * 40; // اندازه بین 40 تا 80
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
    // جهت جدید با حفظ سرعت
    const speed = Math.sqrt(shape.dx * shape.dx + shape.dy * shape.dy) || 1;
    const angle = Math.random() * Math.PI * 2;
    shape.dx = Math.cos(angle) * speed;
    shape.dy = Math.sin(angle) * speed;
  }

  // ----- رسم -----
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

  // ----- بروزرسانی و انیمیشن -----
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
      // تغییر مکان
      shape.x += shape.dx;
      shape.y += shape.dy;

      // برخورد با دیواره‌ها و تغییر مشخصات
      let hitEdge = false;
      if (shape.x - shape.size / 2 < 0 || shape.x + shape.size / 2 > canvas.width) {
        shape.dx *= -1;
        hitEdge = true;
      }
      if (shape.y - shape.size / 2 < 0 || shape.y + shape.size / 2 > canvas.height) {
        shape.dy *= -1;
        hitEdge = true;
      }
      if (hitEdge) {
        randomizeShapeProperties(shape);
      }

      drawShape(shape);
    });

    requestAnimationFrame(animate);
  }

  // ----- کنترل تغییر تم -----
  function updateShapes() {
    currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    shapes.forEach((shape) => {
      shape.color = pickRandomColor(currentTheme);
    });
  }
  // در اختیار script.js قرار می‌گیرد تا هنگام تغییر تم فراخوانی شود
  window.updateShapes = updateShapes;

  // ----- کنترل کلیک -----
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
    // اگر هیچ شکلی کلیک نشد، یکی از شکل‌ها تصادفی عوض شود
    if (!hit && shapes.length > 0) {
      randomizeShapeProperties(shapes[Math.floor(Math.random() * shapes.length)]);
    }
  });

  // ----- واکنش به تغییر اندازه صفحه -----
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // ----- ایجاد اشکال اولیه و شروع -----
  shapes = [];
  for (let i = 0; i < MAX_SHAPES; i++) {
    shapes.push(createShape());
  }
  animate();
})();
// قبل از کد فعلی:
function waitForCanvas(cb){
  const t=setInterval(()=>{ const c=document.getElementById('background-canvas');
    if(c){ clearInterval(t); cb(c); } }, 100);
}
// و به جای: const canvas = document.getElementById("background-canvas");
// بنویس:
waitForCanvas((canvas)=>{ 
  // اینجا بقیه کد فعلی‌ات را قرار بده (یا بدنه‌ی IIFE را داخل این کال‌بک ببر)
});
