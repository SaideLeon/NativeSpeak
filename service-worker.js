const CACHE_NAME = 'nativespeak-cache-v1';

// Adiciona os arquivos que fazem parte do "app shell"
const appShellFiles = [
  '/',
  '/index.html',
  '/index.css',
  '/icon.svg',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e app shell em cache');
        return cache.addAll(appShellFiles);
      })
  );
});

// Limpa caches antigos na ativação
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Excluindo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estratégia Network-first com fallback para o cache
self.addEventListener('fetch', event => {
  // Apenas para requisições GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Se a busca for bem-sucedida, clona e armazena no cache
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            // Não armazena em cache requisições de extensões do chrome
            if (!event.request.url.startsWith('chrome-extension')) {
                 cache.put(event.request, responseToCache);
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se a requisição de rede falhar, tenta servir do cache
        return caches.match(event.request);
      })
  );
});