/* ===== Animated Background Shapes (full-page, theme-aware) ===== */
(function () {
  const canvas = document.getElementById('bg-shapes');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // تعداد کل اشکال (طبق خواسته‌ات 10 تا، اگر خواستی بیشتر کن)
  const MAX_SHAPES = 10;
  // انواع شکل‌ها
  const SHAPE_TYPES = ['circle', 'square', 'triangle', 'hex'];

  // پالت‌های پرکنتراست برای هر تم
  const LIGHT_COLORS = [
    '#1E88E5','#3949AB','#00897B','#D81B60','#E65100','#5E35B1',
    '#1565C0','#2E7D32','#AD1457','#EF6C00','#283593','#00695C',
    '#1976D2','#00796B','#C62828','#6A1B9A','#512DA8','#455A64',
    '#0D47A1','#1B5E20','#7B1FA2','#BF360C','#37474F','#3F51B5'
  ];
  const DARK_COLORS = [
    '#FFEA00','#FFC400','#FF7043','#FF5252','#00E5FF','#69F0AE',
    '#7C4DFF','#18FFFF','#FFAB40','#FF4081','#40C4FF','#84FFFF',
    '#FFD740','#B388FF','#EA80FC','#82B1FF','#A7FFEB','#FF8A65',
    '#FFF176','#80D8FF','#FF6E40','#FF9E80','#FFFF8D','#CCFF90'
  ];

  // وضعیت
  let shapes = [];
  let rafId = null;

  // اندازهٔ بوم = کل صفحه (نه فقط ویوپرت)
  function resizeCanvasToDocument() {
    const doc = document.documentElement;
    const width = Math.max(doc.scrollWidth, doc.clientWidth, window.innerWidth);
    const height = Math.max(doc.scrollHeight, doc.clientHeight, window.innerHeight);
    // فقط وقتی تغییر کرده ست کن (برای کارایی)
    if (canvas.width !== width)  canvas.width  = width;
    if (canvas.height !== height) canvas.height = height;
  }

  // رنگ تصادفی مطابق تم فعلی
  function randomColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    const pal = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    return pal[Math.floor(Math.random() * pal.length)];
  }

  // ساخت یک شکل
  function createShape(x, y) {
    const size = 18 + Math.random() * 28;       // 18..46
    const speed = 0.7 + Math.random() * 1.6;    // سرعت پایه
    // جهت تصادفی
    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;

    return {
      x, y, dx, dy, size,
      type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      color: randomColor(),
      rot: Math.random() * Math.PI,            // برای اشکال چندضلعی
      rotSpeed: (Math.random() - 0.5) * 0.02   // چرخش جزئی
    };
  }

  // پرکردن اولیهٔ کل صفحه
  function seedShapes() {
    shapes = [];
    for (let i = 0; i < MAX_SHAPES; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      shapes.push(createShape(x, y));
    }
  }

  // رسم یک شکل
  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot || 0);

    // جلوهٔ دیده‌شدن بهتر
    ctx.shadowBlur = 12;
    ctx.shadowColor = s.color;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = 0.85;

    switch (s.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        break;
      case 'triangle':
        ctx.beginPath();
        const h = s.size * 0.577; // ارتفاع مثلث متساوی‌الاضلاع
        ctx.moveTo(0, -s.size / 2);
        ctx.lineTo(-s.size / 2, h);
        ctx.lineTo(s.size / 2, h);
        ctx.closePath();
        ctx.fill();
        break;
      case 'hex':
        ctx.beginPath();
        const r = s.size / 2;
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  // آپدیت و حرکت
  function updateShape(s) {
    s.x += s.dx;
    s.y += s.dy;
    s.rot += s.rotSpeed;

    // برخورد با دیواره‌ها + تغییرات تصادفی
    const hitLeft = s.x - s.size / 2 <= 0;
    const hitRight = s.x + s.size / 2 >= canvas.width;
    const hitTop = s.y - s.size / 2 <= 0;
    const hitBottom = s.y + s.size / 2 >= canvas.height;

    if (hitLeft || hitRight) s.dx *= -1;
    if (hitTop || hitBottom) s.dy *= -1;

    if (hitLeft || hitRight || hitTop || hitBottom) {
      if (Math.random() < 0.35) s.color = randomColor();
      if (Math.random() < 0.25) s.size = 18 + Math.random() * 28;
      if (Math.random() < 0.20) s.type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
    }
  }

  // حلقهٔ انیمیشن
  function animate() {
    rafId = requestAnimationFrame(animate);
    // اگر ارتفاع/عرض صفحه عوض شد، بوم را تطبیق بده
    resizeCanvasToDocument();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of shapes) {
      updateShape(s);
      drawShape(s);
    }
  }

  // کلیک = افزودن شکل جدید (بدون انباشت بیش از حد)
  canvas.addEventListener('click', (e) => {
    const x = e.pageX; // چون canvas absolute است
    const y = e.pageY;
    if (shapes.length >= MAX_SHAPES) shapes.shift();
    shapes.push(createShape(x, y));
  });

  // تم که عوض شد، رنگ‌ها را تازه کن
  function refreshColors() {
    shapes.forEach(s => (s.color = randomColor()));
  }

  // اکسپورت برای دکمهٔ تغییر تم داخل سایت
  window.updateShapes = refreshColors;

  // تغییر اندازهٔ محتوا/DOM → تنظیم دوبارهٔ بوم
  const mo = new MutationObserver(() => resizeCanvasToDocument());
  mo.observe(document.body, { childList: true, subtree: true });

  // رویدادهای استاندارد
  window.addEventListener('resize', resizeCanvasToDocument);
  window.addEventListener('orientationchange', resizeCanvasToDocument);

  // شروع
  resizeCanvasToDocument();
  seedShapes();
  animate();

  // اگر صفحه خیلی بلند است و اسکرول می‌کنی، هر چند ثانیه یک‌بار هم اندازه را چک کن
  setInterval(resizeCanvasToDocument, 1500);
})();
