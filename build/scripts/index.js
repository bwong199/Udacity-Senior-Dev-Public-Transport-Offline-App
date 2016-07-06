$(document).ready(function(){var e,a;if(navigator.onLine){console.log("online"),indexedDB.deleteDatabase("trainInfo");var t=indexedDB.open("trainInfo",1);t.onupgradeneeded=function(e){var a=e.target.result;if(!a.objectStoreNames.contains("departure_stations")){var t=a.createObjectStore("departure_stations",{keyPath:"id",autoIncrement:!0});t.createIndex("id","id",{unique:!1})}if(!a.objectStoreNames.contains("arrival_stations")){var t=a.createObjectStore("arrival_stations",{keyPath:"id",autoIncrement:!0});t.createIndex("id","id",{unique:!1})}if(!a.objectStoreNames.contains("duration")){var t=a.createObjectStore("duration",{keyPath:"id",autoIncrement:!0});t.createIndex("id","id",{unique:!1})}},t.onsuccess=function(e){console.log("Success: Opened Database..."),db=e.target.result},t.onerror=function(e){console.log("Error: Could Not Open Database...")};var o="https://transit.land/api/v1/stops",r=setTimeout(function(){alert("failed to get transit data")},4e3);$.ajax({url:o,dataType:"json",jsonp:"callback",success:function(e){var a=db.transaction(["departure_stations"],"readwrite"),t=a.objectStore("departure_stations"),o=e.stops;for(var n in o){var i=o[n].name,s=o[n].onestop_id,d={id:s,name:i};t.add(d);$("#departureOption").append('<option value="'+s+'">'+i+"</option>")}clearTimeout(r)}})}else{console.log("offline");var t=indexedDB.open("trainInfo",1);t.onsuccess=function(e){console.log("Success: Opened Database in offline mode..."),db=e.target.result;var a=db.transaction(["departure_stations"],"readonly"),t=a.objectStore("departure_stations"),o=t.index("id");o.openCursor().onsuccess=function(e){var a=e.target.result;a&&($("#departureOption").append('<option value="'+a.value.id+'">'+a.value.name+"</option>"),a["continue"]())}}}$("#departureBtn").click(function(a){$("#departure").text(" "),a.preventDefault(),$("#arrivalOption").find("option").remove();var t=$("#departureOption option:selected").val();if(e=t,$("p").empty(),navigator.onLine){var o=indexedDB.open("trainInfo",1);o.onsuccess=function(e){console.log("Success: Opened Database for arrival stations..."),db=e.target.result},o.onerror=function(e){console.log("Error: Could Not Open Database for arrival stations...")};var n="https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id="+t;$.ajax({url:n,dataType:"json",jsonp:"callback",success:function(e){console.log("Successfully fetched");var a=[],o=[],n=[],i=e.schedule_stop_pairs;for(var s in i){var d=i[s].destination_onestop_id,u=(i[s].destination_departure_time,i[s].destination_arrival_time,i[s].origin_departure_time,i[s].origin_arrival_time,i[s].trip_headsign);o.push(u),o.push(d),a.push(o)}o=jQuery.unique(o),n=jQuery.unique(n),a=jQuery.unique(a);for(x in a){$("#arrivalOption").append('<option value="'+a[x][1]+'">'+a[x][0]+"</option>");var l=db.transaction(["arrival_stations"],"readwrite"),c=l.objectStore("arrival_stations"),p={arrival_id:a[x][1],departure_station:t,arrival_station:a[x][0]};console.log(p);var v=c.add(p);v.onerror=function(e){console.log("Error",e.target.error.name)},v.onsuccess=function(e){console.log("Woot! Added departure and arrival stations to DB")}}clearTimeout(r)}})}else{console.log("offline");var o=indexedDB.open("trainInfo",1);o.onsuccess=function(e){console.log("Success: Opened Database in offline mode..."),db=e.target.result;var a=db.transaction(["arrival_stations"],"readonly"),o=a.objectStore("arrival_stations"),r=o.index("id");r.openCursor().onsuccess=function(e){var a=e.target.result;a&&t===a.value.departure_station&&$("#arrivalOption").append('<option value="'+a.value.arrival_id+'">'+a.value.arrival_station+"</option>"),a["continue"]()}}}}),$("#arrivalBtn").click(function(t){$("p").empty();var o=$("#arrivalOption option:selected").val();if(a=o,t.preventDefault(),navigator.onLine){var n=indexedDB.open("trainInfo",1);n.onsuccess=function(e){console.log("Success: Opened Database for duration..."),db=e.target.result},n.onerror=function(e){console.log("Error: Could Not Open Database for duration...")};var i="https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id="+o;$.ajax({url:i,dataType:"json",jsonp:"callback",success:function(t){var o=t.schedule_stop_pairs,n=[];for(var i in o){var s=o[i].origin_departure_time,d=(o[i].origin_arrival_time,o[i].destination_departure_time,o[i].destination_arrival_time);$("#departure").append(s+"<br>"),$("#arrival").append(d+"<br>");var u=[];u.push(s),u.push(d),n.push(u),console.log(String(d).substring(3,5)),console.log(String(d).substring(3,5));var l=String(d).substring(3,5)-String(d).substring(12,14);l<0&&(l+=60),console.log(l);var c=db.transaction(["duration"],"readwrite"),p=c.objectStore("duration"),v={departure_id:e,arrival_id:a,departure_time:s,arrival_time:d,duration:l};console.log(v);var f=p.add(v);f.onerror=function(e){console.log("Error",e.target.error.name)},f.onsuccess=function(e){console.log("Woot! Added duration to DB.")}}for(x in n){console.log(n[x]);var l=String(n[x]).substring(12,14)-String(n[x]).substring(3,5);l<0&&(l+=60),$("#duration").append(l+" mins<br>")}clearTimeout(r)}})}else{console.log("offline");var n=indexedDB.open("trainInfo",1);n.onsuccess=function(t){console.log("Success: Opened Database in offline mode for duration object..."),db=t.target.result;var o=db.transaction(["duration"],"readonly"),r=o.objectStore("duration"),n=r.index("id");n.openCursor().onsuccess=function(t){var o=t.target.result;o&&(console.log(o),e===o.value.departure_id&&a===o.value.arrival_id&&($("#departure").append(o.value.departure_time+"<br>"),$("#arrival").append(o.value.arrival_time+"<br>"),$("#duration").append(o.value.duration+" mins<br>"))),o["continue"]()}}}})});