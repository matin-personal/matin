const CACHE_NAME = 'matin-cache-v2'; // ✅ ورژن جدید
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/style.css',
  '/script.js',
  '/menu.js',
  '/menu.html',
  '/footer.html',
  '/header.html',
  '/favicon.png',
  '/favicon.ico',
  '/404.html',
  '/robots.txt',
  '/sitemap.xml',
  '/images/logo.png',
  '/icons/icon1.png'
];

// نصب → کش کردن فایل‌ها
self.addEventListener('install', event => {
  self.skipWaiting(); // ❗ فورس می‌کنه service worker سریع فعال شه
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// فعال‌سازی → حذف کش قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// واکشی فایل‌ها
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
