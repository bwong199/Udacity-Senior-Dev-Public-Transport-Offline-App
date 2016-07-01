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
            // $("#arrivalOption").append("<option value="  + '"' +  id + '">'  + name + "</option>")
          }
          clearTimeout(urlRequestTimeout);
        }
    });


    $("#departureBtn").click(function(event){
        $("#departure").text(" ")
        event.preventDefault();

        // console.log("Departure button pressed");

              //         $("#departure").append(" ");
              // $("#arrival").append(" ");
              $("p").empty();

        var id = $("#departureOption option:selected").val()
        // console.log(id);
        var url = "https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + id 
        // console.log(id);

        $.ajax({
            url: url,
            dataType: "json",
            jsonp: "callback",
            success: function(response) {
       
              var unique = [];
              var uniqueStops = [];
              var uniqueStopID = [];

              var schedule_stops = response["schedule_stop_pairs"]
              for (var stop in schedule_stops){ 
                // console.log(schedule_stops[stop]["destination_departure_time"])
                var destination_id = schedule_stops[stop]["destination_onestop_id"]


                var departure_time = schedule_stops[stop]["destination_departure_time"];
                var arrival_time = schedule_stops[stop]["destination_arrival_time"];

                var origin_departure_time = schedule_stops[stop]["origin_departure_time"];
                var origin_arrival_time = schedule_stops[stop]["origin_arrival_time"];  

                var trip_headsign =  schedule_stops[stop]["trip_headsign"];  

                uniqueStops.push(trip_headsign);
                uniqueStops.push(destination_id)       

                unique.push(uniqueStops);
                // $("#departure").append(origin_departure_time + "<br>");
                // $("#arrival").append(arrival_time + "<br>")
              }

              uniqueStops = jQuery.unique(uniqueStops);
              uniqueStopID = jQuery.unique(uniqueStopID);
              unique = jQuery.unique(unique);

              for (x in unique){
                // console.log(unique[x][0]);
                $("#arrivalOption").append("<option value="  + '"' +  unique[x][1] + '">'  + unique[x][0] + "</option>")

              }




              clearTimeout(urlRequestTimeout);
            }
        });
    })

    $("#arrivalBtn").click(function(event){


         $("p").empty();
        event.preventDefault();

        var id = $("#arrivalOption option:selected").val()
        // console.log(id);
        var url = "https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + id 
  

        $.ajax({
            url: url,
            dataType: "json",
            jsonp: "callback",
            success: function(response) {
              // console.log(response);
              var schedule_stops = response["schedule_stop_pairs"]

              var time_pair = [];


              for (var stop in schedule_stops){ 
                // console.log(schedule_stops[stop]["destination_departure_time"])

                var origin_departure_time = schedule_stops[stop]["origin_departure_time"];
                var origin_arrival_time = schedule_stops[stop]["origin_arrival_time"];  
                var departure_time = schedule_stops[stop]["destination_departure_time"];
                var arrival_time = schedule_stops[stop]["destination_arrival_time"];

              $("#departure").append(origin_departure_time + "<br>");
                $("#arrival").append(arrival_time + "<br>")

                var pair = [];
                pair.push(origin_departure_time);
                pair.push(arrival_time);

                time_pair.push(pair);
              }

              for (x in time_pair){
                // console.log(time_pair[x]);


                // console.log(String(time_pair[x]).substring(3, 5));
                // console.log(String(time_pair[x]).substring(12, 14));
                
                var duration = String(time_pair[x]).substring(12, 14) - String(time_pair[x]).substring(3, 5)
                // console.log(duration);
                if (duration < 0){
                  duration = duration + 60;
                }

                $("#duration").append(duration + "<br>");
              }

              clearTimeout(urlRequestTimeout);
            }
        });
    })

});


    