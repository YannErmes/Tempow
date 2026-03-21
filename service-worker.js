/* ═══════════════════════════════════════════════════════════════════════════════
   TEMPOW SERVICE WORKER — Offline Support & Smart Caching
═══════════════════════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'tempow-v2-cache';
const ASSETS_CACHE = 'tempow-assets-v2';
const RUNTIME_CACHE = 'tempow-runtime';

// Assets to cache immediately on install (critical for offline)
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Google Fonts URLs to pre-cache for offline-first experience
const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap',
  'https://fonts.gstatic.com/s/dmmono/v13/5a6U5-1oa7Zxy-6gHJkp3d0.woff2',
  'https://fonts.gstatic.com/s/dmmono/v13/5a6U5-1oa7Zxy-6gHJkp3AcwWJtd.woff2'
];

/* ─────────────────────────────────────
   SERVICE WORKER INSTALL EVENT
─────────────────────────────────────── */
self.addEventListener('install', event => {
  console.log('[SW] Installing Tempow Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Could not cache all static assets:', err);
      });
    }).then(() => {
      // Pre-cache fonts for offline support
      return caches.open(ASSETS_CACHE).then(cache => {
        return cache.addAll(FONT_URLS).catch(err => {
          console.warn('[SW] Could not pre-cache fonts:', err);
          // Don't fail the install if fonts can't be cached
          return Promise.resolve();
        });
      });
    }).then(() => self.skipWaiting())
  );
});

/* ─────────────────────────────────────
   SERVICE WORKER ACTIVATE EVENT
─────────────────────────────────────── */
self.addEventListener('activate', event => {
  console.log('[SW] Activating Tempow Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== ASSETS_CACHE && 
              cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/* ─────────────────────────────────────
   FETCH EVENT - Network First Strategy
─────────────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return;

  // Strategy 1: HTML documents - Network First
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful HTML responses
          if (response.status === 200) {
            const cache_response = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, cache_response);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cached version
          return caches.match(request).then(cached_response => {
            return cached_response || cacheNotFound();
          });
        })
    );
  }
  // Strategy 2: Images - Cache First (long-term)
  else if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached_response => {
        return cached_response || fetch(request)
          .then(response => {
            if (response.status === 200) {
              const cache_response = response.clone();
              caches.open(ASSETS_CACHE).then(cache => {
                cache.put(request, cache_response);
              });
            }
            return response;
          })
          .catch(() => placeholderImage());
      })
    );
  }
  // Strategy 3: Fonts - Cache First (very long-term)
  else if (request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(cached_response => {
        if (cached_response) return cached_response;
        
        return fetch(request)
          .then(response => {
            if (response.status === 200) {
              const cache_response = response.clone();
              caches.open(ASSETS_CACHE).then(cache => {
                cache.put(request, cache_response);
              });
            }
            return response;
          })
          .catch(() => {
            return new Response('', { status: 404 });
          });
      })
    );
  }
  // Strategy 4: Scripts, Styles - Cache First with network fallback
  else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then(cached_response => {
        return cached_response || fetch(request)
          .then(response => {
            if (response.status === 200) {
              const cache_response = response.clone();
              caches.open(ASSETS_CACHE).then(cache => {
                cache.put(request, cache_response);
              });
            }
            return response;
          })
          .catch(() => {
            return new Response('', { status: 404 });
          });
      })
    );
  }
  // Strategy 5: Everything else - Network First
  else {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const cache_response = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, cache_response);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(cached_response => {
            return cached_response || cacheNotFound();
          });
        })
    );
  }
});

/* ─────────────────────────────────────
   BACKGROUND SYNC (Background Sync API)
─────────────────────────────────────── */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-flow-data') {
    event.waitUntil(syncFlowData());
  }
});

async function syncFlowData() {
  try {
    // Make an authenticated request to a sync endpoint
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        synced: true
      })
    });
    
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Sync failed');
    }
  } catch (error) {
    console.warn('[SW] Background sync failed:', error);
    throw error;
  }
}

/* ─────────────────────────────────────
   MESSAGE HANDLING
─────────────────────────────────────── */
self.addEventListener('message', event => {
  const { type, payload } = event.data;

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  } else if (type === 'KEEP_ALIVE') {
    // Respond to keep-alive pings from client
    event.ports[0].postMessage({ alive: true, timestamp: Date.now() });
  } else if (type === 'CACHE_URLS') {
    // Cache specific URLs requested by client
    if (payload && Array.isArray(payload.urls)) {
      caches.open(RUNTIME_CACHE).then(cache => {
        cache.addAll(payload.urls).catch(err => {
          console.warn('[SW] Could not cache URLs:', err);
        });
      });
    }
  }
});

/* ─────────────────────────────────────
   PUSH NOTIFICATIONS
─────────────────────────────────────── */
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Tempow notification',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle cx="96" cy="96" r="90" fill="%235de0a8"/><circle cx="96" cy="96" r="85" fill="%230e0e11"/></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="45" fill="%235de0a8"/></svg>',
      tag: data.tag || 'tempow-notification',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Tempow', options)
    );
  } catch (error) {
    console.warn('[SW] Push notification error:', error);
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if there is a window with target URL already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

/* ─────────────────────────────────────
   UTILITY FUNCTIONS
─────────────────────────────────────── */
function cacheNotFound() {
  return new Response(
    '<html><body style="background:#0e0e11;color:#f0eff5;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;"><div style="text-align:center;"><h1>📡 Offline</h1><p>This page is not available offline.</p></div></body></html>',
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    }
  );
}

function placeholderImage() {
  return new Response(
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="%231a1a2e" width="200" height="200"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="%236b6a75" font-size="14">Image unavailable</text></svg>',
    {
      headers: { 'Content-Type': 'image/svg+xml' }
    }
  );
}

console.log('[SW] Tempow Service Worker initialized');
