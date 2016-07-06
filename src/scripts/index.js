$(document).ready(function() {

    var departureID;
    var arrivalID;
    // Run if online
    if (navigator.onLine) {
        console.log('online');
        indexedDB.deleteDatabase('trainInfo');
        //Open Database
        var request = indexedDB.open('trainInfo', 1);

        request.onupgradeneeded = function(e) {
            var db = e.target.result;

            if (!db.objectStoreNames.contains('departure_stations')) {
                var os = db.createObjectStore('departure_stations', {
                    keyPath: "id",
                    autoIncrement: true
                });
                //Create Index for Name
                os.createIndex('id', 'id', {
                    unique: false
                });
            }


            if (!db.objectStoreNames.contains('arrival_stations')) {
                var os = db.createObjectStore('arrival_stations', {
                    keyPath: "id",
                    autoIncrement: true
                });
                //Create Index for Name
                os.createIndex('id', 'id', {
                    unique: false
                });
            }

            if (!db.objectStoreNames.contains('duration')) {
                var os = db.createObjectStore('duration', {
                    keyPath: "id",
                    autoIncrement: true
                });
                //Create Index for Name
                os.createIndex('id', 'id', {
                    unique: false
                });
            }
        }

        //Success
        request.onsuccess = function(e) {
            console.log('Success: Opened Database...');
            db = e.target.result;

        }

        //Error
        request.onerror = function(e) {
            console.log('Error: Could Not Open Database...');
        }


        // Fetch Data
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
                var transaction = db.transaction(["departure_stations"], "readwrite");
                //Ask for ObjectStore
                var store = transaction.objectStore("departure_stations");

                var stops = response["stops"]
                for (var stop in stops) {

                    var name = stops[stop]["name"]
                    var id = stops[stop]["onestop_id"]

                    var station = {
                        id: id,
                        name: name
                    }

                    //Perform the Add
                    var request = store.add(station);

                    // console.log(stops[stop]["name"] + " " + id)
                    $("#departureOption").append("<option value=" + '"' + id + '">' + name + "</option>")
                        // $("#arrivalOption").append("<option value="  + '"' +  id + '">'  + name + "</option>")
                }
                clearTimeout(urlRequestTimeout);
            }
        });

    } else {

        console.log("offline");

        var request = indexedDB.open('trainInfo', 1);

        request.onsuccess = function(e) {
            console.log('Success: Opened Database in offline mode...');
            db = e.target.result;

            var transaction = db.transaction(["departure_stations"], "readonly");
            //Ask for ObjectStore
            var store = transaction.objectStore("departure_stations");
            var index = store.index('id');

            var output = '';
            index.openCursor().onsuccess = function(e) {
                var cursor = e.target.result;
                if (cursor) {
                    // console.log(cursor.value.id + " " + cursor.value.name);
                    $("#departureOption").append("<option value=" + '"' + cursor.value.id + '">' + cursor.value.name + "</option>")
                    cursor.continue();
                }

            }
        }
    }




    $("#departureBtn").click(function(event) {
        $("#departure").text(" ")
        event.preventDefault();

        $("#arrivalOption").find('option').remove();

        // console.log("Departure button pressed");

        //         $("#departure").append(" ");
        // $("#arrival").append(" ");

        var id = $("#departureOption option:selected").val()

        departureID = id;

        $("p").empty();
        if (navigator.onLine) {

            var request = indexedDB.open('trainInfo', 1);

            //Success
            request.onsuccess = function(e) {
                console.log('Success: Opened Database for arrival stations...');
                db = e.target.result;

            }

            //Error
            request.onerror = function(e) {
                console.log('Error: Could Not Open Database for arrival stations...');
            }


            // console.log(id);
            var url = "https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + id
                // console.log(id);

            $.ajax({
                url: url,
                dataType: "json",
                jsonp: "callback",
                success: function(response) {
                    console.log("Successfully fetched");
                    var unique = [];
                    var uniqueStops = [];
                    var uniqueStopID = [];

                    var schedule_stops = response["schedule_stop_pairs"]
                    for (var stop in schedule_stops) {
                        // console.log(schedule_stops[stop]["destination_departure_time"])
                        var destination_id = schedule_stops[stop]["destination_onestop_id"]


                        var departure_time = schedule_stops[stop]["destination_departure_time"];
                        var arrival_time = schedule_stops[stop]["destination_arrival_time"];

                        var origin_departure_time = schedule_stops[stop]["origin_departure_time"];
                        var origin_arrival_time = schedule_stops[stop]["origin_arrival_time"];

                        var trip_headsign = schedule_stops[stop]["trip_headsign"];

                        uniqueStops.push(trip_headsign);
                        uniqueStops.push(destination_id)

                        unique.push(uniqueStops);
                        // $("#departure").append(origin_departure_time + "<br>");
                        // $("#arrival").append(arrival_time + "<br>")



                        // request.onsuccess = function(e) {

                        // }

                    }

                    uniqueStops = jQuery.unique(uniqueStops);
                    uniqueStopID = jQuery.unique(uniqueStopID);
                    unique = jQuery.unique(unique);

                    for (x in unique) {
                        // console.log(unique[x][0]);
                        $("#arrivalOption").append("<option value=" + '"' + unique[x][1] + '">' + unique[x][0] + "</option>")

                        var transaction = db.transaction(["arrival_stations"], "readwrite");
                        //Ask for ObjectStore
                        var store = transaction.objectStore("arrival_stations");


                        var station = {
                            arrival_id: unique[x][1],
                            departure_station: id,
                            arrival_station: unique[x][0]
                        }

                        console.log(station);

                        //Perform the Add
                        var request = store.add(station);

                        request.onerror = function(e) {
                            console.log("Error", e.target.error.name);
                            //some type of error handler
                        }

                        request.onsuccess = function(e) {
                            console.log("Woot! Added departure and arrival stations to DB");
                        }
                    }




                    clearTimeout(urlRequestTimeout);
                }
            });
        } else {


            console.log("offline");

            var request = indexedDB.open('trainInfo', 1);

            request.onsuccess = function(e) {
                console.log('Success: Opened Database in offline mode...');
                db = e.target.result;

                var transaction = db.transaction(["arrival_stations"], "readonly");
                //Ask for ObjectStore
                var store = transaction.objectStore("arrival_stations");
                var index = store.index('id');

                var output = '';
                index.openCursor().onsuccess = function(e) {
                    var cursor = e.target.result;


                    if (cursor) {
                        if (id === cursor.value.departure_station) {
                            $("#arrivalOption").append("<option value=" + '"' + cursor.value.arrival_id + '">' + cursor.value.arrival_station + "</option>")
                        }

                    }
                    cursor.continue();
                }
            }
        }




    })

    $("#arrivalBtn").click(function(event) {


        $("p").empty();

        var id = $("#arrivalOption option:selected").val()
        arrivalID = id;

        event.preventDefault();

        if (navigator.onLine) {

            var request = indexedDB.open('trainInfo', 1);

            //Success
            request.onsuccess = function(e) {
                console.log('Success: Opened Database for duration...');
                db = e.target.result;

            }

            //Error
            request.onerror = function(e) {
                console.log('Error: Could Not Open Database for duration...');
            }

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



                    for (var stop in schedule_stops) {
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

                        console.log(String(arrival_time).substring(3, 5));
                        console.log(String(arrival_time).substring(3, 5))

                        var duration = String(arrival_time).substring(3, 5) - String(arrival_time).substring(12, 14)

                        if (duration < 0) {
                            duration = duration + 60;
                        }

                        console.log(duration);


                        var transaction = db.transaction(["duration"], "readwrite");
                        //Ask for ObjectStore
                        var store = transaction.objectStore("duration");



                        var times = {
                            departure_id: departureID,
                            arrival_id: arrivalID,
                            departure_time: origin_departure_time,
                            arrival_time: arrival_time,
                            duration: duration
                        }

                        console.log(times);
                        //Perform the Add
                        var request = store.add(times);

                        request.onerror = function(e) {
                            console.log("Error", e.target.error.name);
                            //some type of error handler
                        }

                        request.onsuccess = function(e) {
                            console.log("Woot! Added duration to DB.");
                        }
                    }

                    for (x in time_pair) {
                        console.log(time_pair[x]);


                        // console.log(String(time_pair[x]).substring(3, 5));
                        // console.log(String(time_pair[x]).substring(12, 14));

                        var duration = String(time_pair[x]).substring(12, 14) - String(time_pair[x]).substring(3, 5)
                            // console.log(duration);
                        if (duration < 0) {
                            duration = duration + 60;
                        }

                        $("#duration").append(duration + " mins" + "<br>");



                    }

                    clearTimeout(urlRequestTimeout);
                }
            });
        } else {

            console.log("offline");

            var request = indexedDB.open('trainInfo', 1);

            request.onsuccess = function(e) {
                console.log('Success: Opened Database in offline mode for duration object...');
                db = e.target.result;

                var transaction = db.transaction(["duration"], "readonly");
                //Ask for ObjectStore
                var store = transaction.objectStore("duration");
                var index = store.index('id');

                var output = '';
                index.openCursor().onsuccess = function(e) {
                    var cursor = e.target.result;


                    if (cursor) {
                        console.log(cursor);

                        if (departureID === cursor.value.departure_id && arrivalID === cursor.value.arrival_id) {
                          $("#departure").append(cursor.value.departure_time + "<br>");
                          $("#arrival").append(cursor.value.arrival_time + "<br>")

                          $("#duration").append(cursor.value.duration + " mins" + "<br>");
                        }

                    } 
                    cursor.continue();
                }
            }
        }


    })

});