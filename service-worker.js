/* ════════════════════════════════════════════
   TEMPOW SERVICE WORKER v2
   Offline-first caching + background sync
══════════════════════════════════════════ */

const CACHE_NAME = 'tempow-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap'
];

/* ─────────────────────────────────────────
   INSTALL — Pre-cache core assets
───────────────────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets...');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('[SW] Some assets failed to cache (may be offline):', err);
        // Don't fail the install if network assets can't be cached
        return Promise.resolve();
      });
    }).then(() => {
      console.log('[SW] Install complete');
      self.skipWaiting();
    })
  );
});

/* ─────────────────────────────────────────
   ACTIVATE — Clean up old caches
───────────────────────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'CACHE_UPDATED' }));
      });
    })
  );
});

/* ─────────────────────────────────────────
   FETCH — Smart cache-first strategy
───────────────────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const { method, url } = request;

  // Skip non-GET requests
  if (method !== 'GET') {
    return;
  }

  // Skip external domains (let them fail naturally if offline)
  if (!url.includes(self.location.origin) && !url.includes('fonts.googleapis')) {
    return;
  }

  // ── HTML Documents: Network-first with offline fallback
  if (request.headers.get('accept')?.includes('text/html') || url.endsWith('/') || url.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful HTML for offline
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clone);
            }).catch(e => console.log('[SW] Cache write failed:', e));
          }
          return response;
        })
        .catch(() => {
          // Serve stale HTML from cache or offline page
          return caches.match(request)
            .then(cached => cached || caches.match('/index.html'))
            .catch(() => new Response('Offline - Please check your connection', { 
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            }));
        })
    );
    return;
  }

  // ── Fonts: Cache-first (long-lived)
  if (url.includes('fonts.googleapis') || url.includes('fonts.gstatic')) {
    event.respondWith(
      caches.match(request)
        .then(cached => cached || fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }))
        .catch(() => new Response('', { status: 404 }))
    );
    return;
  }

  // ── API/Data requests: Network-first
  if (url.includes('/api/') || url.includes('.json')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok && response.status < 400) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(cached => cached || new Response(JSON.stringify({ offline: true }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }));
        })
    );
    return;
  }

  // ── Default: Cache-first for everything else
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request).then(response => {
        if (response.ok && response.status < 400) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
          });
        }
        return response;
      }))
      .catch(() => new Response('Resource not available offline', { status: 503 }))
  );
});

/* ─────────────────────────────────────────
   MESSAGE HANDLING
───────────────────────────────────────────── */
self.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      // Force update and take over
      self.skipWaiting();
      break;

    case 'KEEP_ALIVE':
      // Background sync keep-alive (no-op but prevents idle)
      break;

    case 'CLEAR_CACHE':
      // Manual cache clear
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
        event.ports[0]?.postMessage({ success: true });
      });
      break;

    case 'GET_CACHE_SIZE':
      // Estimate cache storage usage
      caches.open(CACHE_NAME).then(cache => {
        cache.keys().then(requests => {
          event.ports[0]?.postMessage({ 
            size: `~${(requests.length * 150).toLocaleString()} KB (estimate)`,
            itemCount: requests.length
          });
        });
      });
      break;

    default:
      console.log('[SW] Unknown message type:', type);
  }
});

/* ─────────────────────────────────────────
   BACKGROUND SYNC
───────────────────────────────────────────── */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-flow-data') {
    event.waitUntil(
      // This would sync data with server if available
      Promise.resolve().then(() => {
        console.log('[SW] Background sync triggered: sync-flow-data');
      })
    );
  }
  if (event.tag === 'sync-analytics') {
    event.waitUntil(
      Promise.resolve().then(() => {
        console.log('[SW] Background sync triggered: sync-analytics');
      })
    );
  }
});

/* ─────────────────────────────────────────
   PERIODIC BACKGROUND SYNC
───────────────────────────────────────────── */
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      // Refresh cache every 24 hours
      fetch('/').then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put('/', response);
          });
        }
      }).catch(err => console.log('[SW] Periodic sync failed:', err))
    );
  }
});

/* ─────────────────────────────────────────
   NOTIFICATION CLICK
───────────────────────────────────────────── */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      // Find existing window or open new one
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

console.log('[SW] Service Worker loaded and ready');
