const cacheName =  'v1';

self.addEventListener('install', e => console.log('Service Worker: Installed...'));

self.addEventListener('active', e => {
    console.log('Service Worker: Activated...');
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    ).then(self.skipWaiting());
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
        .then(res => {
            // make a clone of response
            const resClone = res.clone();
            //open response to cache
            caches.open(cacheName).then( cache => {
                // save response to cache
                cache.put(e.request, resClone);
            });
            return res;
        })
        .catch(err => {
            caches.match(e.request).then(res => res);
        })
    );
})