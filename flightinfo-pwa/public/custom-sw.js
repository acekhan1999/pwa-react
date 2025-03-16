// Increment this every time you change the file list or SW logic:
const CACHE_NAME = 'new-flightinfo-pwa-v2';

// Replace these with your exact hashed filenames from the build output:
const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/manifest.json', // optional if you want the web app manifest offline
    '/static/css/main.e6c13ad2.css',
    '/static/js/main.c9102824.js',
    '/static/js/488.fd50b34a.chunk.js'
];  

// INSTALL: Cache the app shell
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing flightinfo-pwa...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(
                urlsToCache.map(url => {
                    return fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                console.log(`${url} caching: false`);
                                return false;
                            }
                            return cache.put(url, response.clone())
                                .then(() => {
                                    console.log(`${url} caching: true`);
                                    return true;
                                })
                                .catch(err => {
                                    console.error(`${url} caching: false`, err);
                                    return false;
                                });
                        })
                        .catch(err => {
                            console.error(`${url} caching: false`, err);
                            return false;
                        });
                })
            );
        })
    );
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating flightinfo-pwa...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            console.log('All Cache Names:', cacheNames);
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', name);
                        return caches.delete(name);
                    }
                    return null;
                })
            );
        }).then(() => {
            // After cleanup, open the current cache
            return caches.open(CACHE_NAME);
        }).then(cache => {
            // Check all files in urlsToCache
            return Promise.all(
                urlsToCache.map(url => {
                    return cache.match(url).then(response => {
                        if (response) {
                            console.log(`[Service Worker] Activation validated: ${url} is in cache.`);
                            return true;
                        } else {
                            console.error(`[Service Worker] Activation validation failed: ${url} is missing.`);
                            return false;
                        }
                    });
                })
            );
        })
    );
});

// FETCH: Serve from cache if available, otherwise go to network
self.addEventListener('fetch', event => {
    // Log the URL being requested
    console.log('[Service Worker] Fetch event for:', event.request.url);

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                // If found in cache, serve it and log a message
                console.log('[Service Worker] Serving from cache:', event.request.url);
                return response;
            } else {
                // Otherwise, fetch from network and log a message
                console.log('[Service Worker] No cache found, fetching from network:', event.request.url);
                return fetch(event.request);
            }
        })
    );
});