// /animated-shapes.js
(() => {
  // 1) create or reuse canvas
  let canvas = document.getElementById('bg-shapes');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-shapes';
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '-1',         // پشتِ محتوا
      pointerEvents: 'none' // کلیک‌ها مزاحم UI نشه (خودمون روی document گوش می‌دیم)
    });
    document.body.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const MAX = 10;
  const TYPES = ['circle', 'square', 'triangle'];
  let shapes = [];
  let darkMode = (document.documentElement.getAttribute('data-theme') || '').toLowerCase() === 'dark';

  function pickColor() {
    if (darkMode) {
      const palette = ['#ffd166','#06d6a0','#118ab2','#ef476f','#ffadad','#d0f4de','#cdb4db','#f6bd60','#84a59d','#f28482','#ffd60a','#00f5d4','#9b5de5','#f15bb5','#fee440','#00bbf9','#00f5d4','#b8f2e6','#ffca3a','#8ac926','#1982c4','#6a4c93','#ff595e','#ff924c'];
      return palette[Math.floor(Math.random()*palette.length)];
    } else {
      const palette = ['#8ecae6','#bde0fe','#c1d6f2','#f3c4fb','#ffd6a5','#b9fbc0','#ffc6ff','#caf0f8','#e9edc9','#d0f4de','#a0c4ff','#cfbaf0','#caffbf','#fdffb6','#ffd6a5','#bdb2ff','#fec5bb','#fae1dd','#e5e5e5','#cfd8dc','#b2dfdb','#dcedc8','#ffccbc','#ffe0b2'];
      return palette[Math.floor(Math.random()*palette.length)];
    }
  }

  function makeShape(x, y) {
    const size = 12 + Math.random()*28;
    const type = TYPES[Math.floor(Math.random()*TYPES.length)];
    const dx = (Math.random()-0.5)*1.8;
    const dy = (Math.random()-0.5)*1.8;
    return { x, y, dx, dy, size, type, color: pickColor() };
  }

  function draw(s) {
    ctx.save();
    ctx.globalAlpha = 0.25;      // مزاحم خوانایی متن نشه
    ctx.fillStyle = s.color;
    ctx.beginPath();
    if (s.type === 'circle') {
      ctx.arc(s.x, s.y, s.size/2, 0, Math.PI*2);
      ctx.fill();
    } else if (s.type === 'square') {
      ctx.fillRect(s.x - s.size/2, s.y - s.size/2, s.size, s.size);
    } else {
      ctx.moveTo(s.x, s.y - s.size/2);
      ctx.lineTo(s.x - s.size/2, s.y + s.size/2);
      ctx.lineTo(s.x + s.size/2, s.y + s.size/2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of shapes) {
      s.x += s.dx;
      s.y += s.dy;

      let hit = false;
      if (s.x <= 0 || s.x >= canvas.width) { s.dx *= -1; hit = true; }
      if (s.y <= 0 || s.y >= canvas.height) { s.dy *= -1; hit = true; }

      if (hit) {
        if (Math.random() < 0.4) s.color = pickColor();
        if (Math.random() < 0.3) s.size = 12 + Math.random()*28;
        if (Math.random() < 0.2) s.type = TYPES[Math.floor(Math.random()*TYPES.length)];
      }
      draw(s);
    }
    requestAnimationFrame(tick);
  }

  // چند شکل اولیه
  for (let i = 0; i < 5; i++) {
    shapes.push(makeShape(Math.random()*canvas.width, Math.random()*canvas.height));
  }
  tick();

  // کلیک روی صفحه → شکل جدید
  document.addEventListener('click', (e) => {
    const tag = e.target.tagName;
    if (/(A|BUTTON|INPUT|TEXTAREA|SELECT)/.test(tag)) return; // روی کنترل‌ها اضافه نکن
    if (shapes.length >= MAX) shapes.shift();
    shapes.push(makeShape(e.clientX, e.clientY));
  });

  // آپدیت تم از بیرون
  window.updateBgShapesTheme = (newTheme) => {
    darkMode = (newTheme || '').toLowerCase() === 'dark';
    for (const s of shapes) if (Math.random() < 0.5) s.color = pickColor();
  };
})();
