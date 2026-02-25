// 缓存名称（更新内容时修改版本号，触发缓存更新）
const CACHE_NAME = 'docs-knowledge-base-v1';
// 需要缓存的核心资源
const CACHE_ASSETS = [
    '/Docs/',
    '/Docs/index.html',
    '/Docs/README.md',
    '/Docs/_sidebar.md',
    '/Docs/_navbar.md'
];

// 安装阶段：缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ASSETS))
            .then(() => self.skipWaiting()) // 立即激活新的 Service Worker
    );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim()) // 接管所有打开的页面
    );
});

// 请求阶段：优先从缓存加载，无缓存则从网络获取
self.addEventListener('fetch', (event) => {
    // 忽略 GitHub 相关的跨域请求
    if (event.request.url.includes('github.com')) {
        return fetch(event.request);
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 缓存有则返回，无则从网络获取
                return response || fetch(event.request).then(fetchResponse => {
                    // 把新获取的资源加入缓存（仅缓存同源资源）
                    if (fetchResponse && fetchResponse.ok && event.request.url.includes(self.location.origin)) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                        });
                    }
                    return fetchResponse;
                });
            })
    );
});