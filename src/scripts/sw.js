this.addEventListener('install', function(event) {
  console.log(event);
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '../index.html'
        // 'http://localhost:5000/Senior_Dev_Public_Transport_App'


      ]);
    })
  );
});

this.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){
       
                    return caches.delete(keys[i]);
                
            }))
        })
    )
});

this.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v1').then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('index.html');
  }));
});


