const CACHE_NAME='physio-trainer-shell-1.2.2';
const CORE_ASSETS=[
  './',
  './index.html',
  './manifest.webmanifest',
  './version.json',
  './icon-192.png',
  './icon-512.png',
  './audio/unlock.mp3',
  './audio/exercise-end.mp3',
  './audio/pause-end.mp3',
  './audio/voice/pause.mp3',
  './audio/voice/weiter.mp3'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache=>{
        // Cache each file separately. One missing file must NOT abort the entire install.
        await Promise.allSettled(
          CORE_ASSETS.map(async url=>{
            try{
              const req=new Request(url,{cache:'reload'});
              const res=await fetch(req);
              if(res.ok)await cache.put(url,res.clone());
            }catch{}
          })
        );
      })
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(k=>k.startsWith('physio-trainer-shell-')&&k!==CACHE_NAME)
            .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;

  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  // Update version must always prefer the network.
  if(url.pathname.endsWith('/version.json')){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(res=>{
          if(res?.ok){
            const copy=res.clone();
            caches.open(CACHE_NAME).then(c=>c.put('./version.json',copy)).catch(()=>{});
          }
          return res;
        })
        .catch(()=>caches.match('./version.json'))
    );
    return;
  }

  // App navigation: network-first, cached index fallback.
  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req)
        .then(res=>{
          if(res?.ok){
            const copy=res.clone();
            caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy)).catch(()=>{});
          }
          return res;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  // Audio: cache on first use. This avoids an all-or-nothing preload of 120+ voice files.
  if(url.pathname.includes('/audio/')){
    event.respondWith(
      caches.match(req,{ignoreSearch:true}).then(async hit=>{
        if(hit)return hit;
        try{
          const res=await fetch(req);
          if(res?.ok){
            const clean=new Request(url.origin+url.pathname);
            const copy=res.clone();
            caches.open(CACHE_NAME).then(c=>c.put(clean,copy)).catch(()=>{});
          }
          return res;
        }catch{
          return Response.error();
        }
      })
    );
    return;
  }

  // Everything else: cache first, then network and remember it.
  event.respondWith(
    caches.match(req,{ignoreSearch:true}).then(async hit=>{
      if(hit)return hit;
      const res=await fetch(req);
      if(res?.ok){
        const copy=res.clone();
        caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});
      }
      return res;
    })
  );
});
