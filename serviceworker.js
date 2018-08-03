self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('restaurant-reviews').then(function(cache) {
      return cache.addAll([
        '/',
        '/img/',
        'index.html',
        'restaurant.html',
        'css/styles.css',
        'css/responsive.css',
        'js/main.js',
        'js/restaurant_info.js',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
        'app.js',
        'serviceworker.js',
        'js/dbhelper.js',
        'js/imagehelper.js',
        'js/imagehelper.js',
        'js/restaurant_info.js'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('now ready to handle fetches!')
});

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) return response;
        return fetch(event.request);
      })
    );
});
