const CACHE_NAME = 'nativespeak-cache-v1';

// Add files that are part of the "app shell"
const appShellFiles = [
  './',
  './index.html',
  './index.css',
  './index.tsx',
  './icon.svg',
  './manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(appShellFiles);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      try {
        const networkResponse = await fetch(event.request);
        // Do not cache chrome extension requests
        if (!event.request.url.startsWith('chrome-extension://')) {
          // Check for valid response before caching
          if (networkResponse && networkResponse.ok) {
            await cache.put(event.request, networkResponse.clone());
          }
        }
        return networkResponse;
      } catch (error) {
        console.error('Fetching failed:', error);
        // Optionally, you can return a fallback offline page here.
        // For now, we'll let the request fail.
        throw error;
      }
    })
  );
});


// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
