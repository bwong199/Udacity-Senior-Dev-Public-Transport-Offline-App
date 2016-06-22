// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js', { scope: '/Senior_Dev_Public_Transport_App/' }).then(function(reg) {
//     // registration worked
//     console.log('Registration succeeded. Scope is ' + reg.scope);
//   }).catch(function(error) {
//     // registration failed
//     console.log('Registration failed with ' + error);
//   });
// };


if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./scripts/sw.js')
           .then(function() { console.log("Service Worker Registered"); })
	.catch(function(error) {
	    // registration failed
	    console.log('Registration failed with ' + error);
	  });
}
$(document).ready(function(){

    var url = "https://transit.land/api/v1/stops";
    var urlRequestTimeout = setTimeout(function() {
        alert("failed to get transit data");
    }, 4000);

    $.ajax({
        url: url,
        dataType: "json",
        jsonp: "callback",
        success: function(response) {
          // console.log(response);
          var stops = response["stops"]
          for (var stop in stops){

            var name = stops[stop]["name"]
            var id = stops[stop]["onestop_id"]
            // console.log(stops[stop]["name"] + " " + id)
            $("#departureOption").append("<option value="  + '"' +  id + '">'  + name + "</option>")
            $("#arrivalOption").append("<option value="  + '"' +  id + '">'  + name + "</option>")
          }
          clearTimeout(urlRequestTimeout);
        }
    });


    $("#departureBtn").click(function(event){
        $("#departure").text(" ")
        event.preventDefault();

        var id = $("#departureOption option:selected").val()
        console.log(id);
        var url = "https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + id 
        console.log(id);

        $.ajax({
            url: url,
            dataType: "json",
            jsonp: "callback",
            success: function(response) {
              // console.log(response);
              var schedule_stops = response["schedule_stop_pairs"]
              for (var stop in schedule_stops){ 
                console.log(schedule_stops[stop]["destination_departure_time"])

                var departure_time = schedule_stops[stop]["destination_departure_time"];
                var arrival_time = schedule_stops[stop]["destination_arrival_time"];


                $("#departure").append(departure_time + "<br>");
                // $("#arrival").append(arrival_time + "<br>")
              }
              clearTimeout(urlRequestTimeout);
            }
        });
    })

    $("#arrivalBtn").click(function(event){
        $("#arrival").text(" ")
        event.preventDefault();

        var id = $("#arrivalOption option:selected").val()
        console.log(id);
        var url = "https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + id 
  

        $.ajax({
            url: url,
            dataType: "json",
            jsonp: "callback",
            success: function(response) {
              // console.log(response);
              var schedule_stops = response["schedule_stop_pairs"]
              for (var stop in schedule_stops){ 
                console.log(schedule_stops[stop]["destination_departure_time"])

                var departure_time = schedule_stops[stop]["destination_departure_time"];
                var arrival_time = schedule_stops[stop]["destination_arrival_time"];


                $("#arrival").append(arrival_time + "<br>")
              }
              clearTimeout(urlRequestTimeout);
            }
        });
    })

});


    
this.addEventListener('install', function(event) {
  console.log(event);
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      console.log('Opened cache');
      return cache.addAll([
        '/',
        '/scripts/index.js', 
        '/scripts/app.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js',
        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js'
      ])
      .then(() => self.skipWaiting());
    })
  );
});

this.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
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


