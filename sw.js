const C="ginette-v8";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./prices.js","./fonts/fredoka-latin-400-normal.woff2","./fonts/fredoka-latin-500-normal.woff2","./fonts/fredoka-latin-600-normal.woff2","./fonts/fredoka-latin-700-normal.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=="GET")return;
  e.respondWith(fetch(u.href,{cache:"no-cache"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));});
