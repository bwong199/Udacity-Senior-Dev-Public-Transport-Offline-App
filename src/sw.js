this.addEventListener('install', function(event) {
  console.log(event);
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      console.log('Opened cache');
      return cache.addAll([
        '/',
        '/index.html', 
        '/app.js',
        '/scripts/index.js',
        '/scripts/bootstrap.min.js',
        '/scripts/jquery.min.js',
        'http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js',
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js',
        'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.4.min.js'
      ])
    })
  );
});

this.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// this.addEventListener('activate', function(event) {

//   var cacheWhitelist = ['v1'];

//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.map(function(cacheName) {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// this.addEventListener('fetch', function(event) {
//   console.log(event.request.url);
//   var response;
//   event.respondWith(caches.match(event.request).catch(function() {
//     return fetch(event.request);
//   }).then(function(r) {
//     response = r;
//     caches.open('v1').then(function(cache) {
//       cache.put(event.request, response);
//     });
//     return response.clone();
//   }).catch(function() {
//     return caches.match('/');
//   }));
// });


