// Service worker: netwerk-eerst (je ziet altijd de nieuwste versie als je
// online bent), cache als terugval zodat het spel offline blijft werken.
const CACHE = 'crimson-ledger-v18';
const CORE = ['./', './index.html', './style.css', './app.js', './motion.js', './rive-art.js', './board.js', './floorplan.js', './logic-engine.js',
              './story.js', './themes.js', './campaign.js', './progress.js', './mentor.js', './sound.js', './avatars.js', './manifest.json',
              './mapart.js', './minigame.js', './store.js', './meting.js', './i18n.js', './grammar.js', './icons.js', './i18n/en.js', './assets/vandam.jpg', './assets/vandam-sketch.jpg',
              './assets/fonts/PlayfairDisplay-normal.woff2', './assets/fonts/PlayfairDisplay-italic.woff2', './assets/fonts/Inter-normal.woff2',
              './icon-192.png', './icon-512.png',
              // 1.6: Rive (levende streakvlam en Van Dam in de briefing), zodat het ook offline vanaf de eerste keer werkt
              './vendor/rive/rive.js', './vendor/rive/rive.wasm', './assets/rive/vlam.riv', './assets/rive/vandam.riv'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
