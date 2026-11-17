/* OptiDesk offline application shell. All paths are relative to this worker's scope. */
'use strict';

const CACHE_PREFIX = 'optidesk-pwa-';
const CACHE_NAME = CACHE_PREFIX + 'v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192-maskable.png',
  './icons/icon-512-maskable.png'
];

function inAppScope(url) {
  return url.origin === self.location.origin && url.href.startsWith(self.registration.scope);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const scopedAssets = APP_SHELL.map(path => new URL(path, self.registration.scope).toString());
    await cache.addAll(scopedAssets);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(name => {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) {
        return caches.delete(name);
      }
      return Promise.resolve(false);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  // Do not intercept external links (for example, WhatsApp sharing) or requests
  // outside this GitHub Pages repository path.
  if (!inAppScope(requestUrl)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok && response.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        const cachedPage = await caches.match(request, { ignoreSearch: true });
        if (cachedPage) return cachedPage;
        const appIndex = await caches.match(new URL('./index.html', self.registration.scope).toString());
        if (appIndex) return appIndex;
        return new Response('OptiDesk is not available offline yet. Open it online once to cache the app.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic' && !requestUrl.search) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});
