const CACHE_NAME = 'ferramentas-rede-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/app.js',
  './js/carimbo.js',
  './js/calculadora.js',
  './js/abaco.js',
  './js/nsap.js',
  './js/gestao.js',
  './js/firebase-config.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://logopng.com.br/logos/vivo-120.svg'
];

// Instalação do Service Worker e caching de recursos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pré-cacheando recursos estáticos');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de cache: Network-First com Fallback de Cache para solicitações dinâmicas,
// ou Cache-First para recursos estáticos cacheados de CDN ou locais.
self.addEventListener('fetch', (event) => {
  // Ignorar requisições ao Firebase API (Authentication/Firestore) para não quebrar chamadas dinâmicas
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Retorna o cacheado imediatamente, mas tenta atualizar em background (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            /* Silencia falhas na rede offline */
          });
        return cachedResponse;
      }

      // Se não estiver em cache, tenta buscar na rede
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fallback offline genérico se necessário
          console.log('[Service Worker] Falha ao recuperar da rede:', event.request.url);
        });
    })
  );
});
