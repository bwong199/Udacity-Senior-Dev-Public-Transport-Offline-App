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
            $("select").append("<option value="  + '"' +  id + '">'  + name + "</option>")

          }
          clearTimeout(urlRequestTimeout);
        }
    });


    $("button").click(function(event){
        $("p").text(" ")
        event.preventDefault();

        var id = $("select option:selected").val()
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


