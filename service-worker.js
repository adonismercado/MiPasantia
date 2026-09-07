const CACHE_NAME = "control-horas-v2";

const ARCHIVOS_CACHE = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./js/calculations.js",
    "./js/storage.js",
    "./js/app.js",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ARCHIVOS_CACHE);
            })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(nombre => nombre !== CACHE_NAME)
                    .map(nombre => caches.delete(nombre))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copia = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, copia);
                    });

                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});