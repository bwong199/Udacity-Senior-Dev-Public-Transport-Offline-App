this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('CT_GTFS').then(function(cache) {
      return cache.addAll([
        '/CT_GTFS/agency.txt',
        '/CT_GTFS/calendar.txt',
        '/CT_GTFS/calendar_dates.txt',
        '/CT_GTFS/routes.txt',
        '/CT_GTFS/shapes.txt',
        '/CT_GTFS/stop_times.txt',
        '/CT_GTFS/shops.txt',
        '/CT_GTFS/trips.txt',

      ]);
    })
  );
});