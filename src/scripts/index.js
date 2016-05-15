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

                var time = schedule_stops[stop]["destination_departure_time"]



                $("p").append(time + "<br>")
              }
              clearTimeout(urlRequestTimeout);
            }
        });
    })
});


    