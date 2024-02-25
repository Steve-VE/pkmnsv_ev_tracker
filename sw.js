__PREFIX__ = "0.0.2";
__OFFLINE_URL__ = '/index.html';
__DEVMODE__ = true;

const log = (text) => {
    if (__DEVMODE__) {
        console.log(`-- [${__PREFIX__}] ${text}`);
    }
};

self.addEventListener('install', (ev) => {
    self.skipWaiting();
    const loadOfflinePage = async () => {
        const cache = await caches.open(__PREFIX__);
        cache.add(new Request(__OFFLINE_URL__));
    }
    ev.waitUntil(loadOfflinePage());
    log(`Service Worker installed.`);
});

self.addEventListener('activate', (ev) => {
    clients.claim();
    const cleanCaches = async () => {
        const keys = await caches.keys();
        const promises = [];
        for (const key of keys) {
            if (key.includes(__PREFIX__)) {
                promises.push(caches.delete(key));
            }
        }
        return Promise.all(promises);
    };
    ev.waitUntil(cleanCaches());

    log(`Service Worker activate.`);
});

self.addEventListener('fetch', (ev) => {
    const { mode, url } = ev.request;
    log(`Fetching: ${url}, mode: ${mode}`);
    if (mode === 'navigate') {
        const handleRequest = async () => {
            try {
                const preloadResponse = await ev.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                return await fetch(ev.request);
            } catch (e) {
                const cache = await caches.open(__PREFIX__);
                return await cache.match(__OFFLINE_URL__);
            }
        };
        ev.respondWith(handleRequest());
    }
});
