if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/Senior_Dev_Public_Transport_App/' }).then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
};