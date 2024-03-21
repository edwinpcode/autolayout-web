const CACHE_NAME = '1up'
const url = ['index.html', 'offline.html', '/images/logo_1up_sidebar.png']

const self = this

// install SW
self.addEventListener('install', (event) => {
    event.waiUntil(caches.open(CACHE_NAME).then((cache) => {
        console.log('open cache')
        return cache.addAll(url)
    }))
})
// listen for request
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request).catch(() => caches.match('offline.html'))
        })
    )
})
// active sw
self.addEventListener('activate', (event) => {
    const cacheList = [];
    cacheList.push(CACHE_NAME)
    event.waiUntil(
        caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => {
            if(!cacheList.includes(cacheName)){
                return caches.delete(cacheName)
            }
        })))
    )
})