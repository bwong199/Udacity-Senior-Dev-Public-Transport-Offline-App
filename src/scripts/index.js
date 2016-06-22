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


    