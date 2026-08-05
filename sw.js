/* BG Products dashboard — service worker (v2, update-safe).
   Purpose: installable app + offline after first visit, WITHOUT ever masking a new deploy.
   Key rules:
     - version.txt and sw.js are NEVER served from cache (always network, no-store) so the
       in-page "update available" check and the worker itself always see the latest.
     - HTML navigations are network-first with no-store, so an online visit always gets the
       newest dashboard; the cached copy is used only when truly offline.
     - icons/manifest stay cache-first (they rarely change). */

var CACHE = 'bg-dash-shell-v2';
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function () {}); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE && k.indexOf('bg-dash-') === 0) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;   // skip blob:, data:, chrome-extension:
  if (url.origin !== self.location.origin) return;                    // only our own files

  var path = url.pathname;

  // version.txt and sw.js: ALWAYS network, never cached — this is what makes updates show.
  if (/\/version\.txt$/.test(path) || /\/sw\.js$/.test(path)) {
    e.respondWith(
      fetch(req.url, { cache: 'no-store' }).catch(function () { return caches.match(req); })
    );
    return;
  }

  var isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') >= 0;

  if (isHTML) {
    // Network-first with no-store so an online visit always gets the latest deployed dashboard;
    // fall back to the cached copy only when offline.
    e.respondWith(
      fetch(req.url, { cache: 'no-store' }).then(function (res) {
        try { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('./index.html', copy); }); } catch (err) {}
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (m) { return m || caches.match('./'); });
      })
    );
    return;
  }

  // Everything else (icons, manifest): cache-first, then network.
  e.respondWith(
    caches.match(req).then(function (m) {
      return m || fetch(req).then(function (res) {
        try { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); } catch (err) {}
        return res;
      });
    })
  );
});
