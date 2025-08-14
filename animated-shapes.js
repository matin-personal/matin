// animated-shapes.js
// ابتدا تلاش می‌کنیم کانواس جدید را پیدا کنیم؛ اگر نبود، از نام قدیمی استفاده می‌کنیم.
let canvas = document.getElementById("background-canvas");
if (!canvas) {
  canvas = document.getElementById("bg-shapes");
}
const ctx = canvas.getContext("2d");

// … بقیه کد بدون تغییر …
