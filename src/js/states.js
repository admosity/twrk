
module = require('./bootstrap');

// function pipeline (funcs) {
//   return function() {
//     funcs.forEach(function(f) {
//       f();
//     });
//   };
// }
module.config(
  function($stateProvider) {

    $stateProvider

      .state('landing', {
        url: '/',
        views: {

          'content': {
            controller: "LandingCtrl",
            templateUrl: "/views/landing.html"
          },

        },
      })

      .state('watch-twerk', {
        url: '/watch',
        views: {

          'content': {
            templateUrl: "/views/watch-twerk.html"
          },

        }
      })

      .state('twerk-setup', {
        views: {

          'content': {
            templateUrl: "/views/twerk-setup.html"
          },

        }
      })

      .state('twerk-calibrate', {
        views: {

          'content': {
            templateUrl: "/views/twerk-calibrate.html"
          },

        }
      })

      .state('twerk-do', {
        views: {
          content: {
            templateUrl: '/views/twerk-do.html'
          }
        }
      })


      .state('twerk-howto', {
        views: {
          content: {
            templateUrl: '/views/twerk-howto.html'
          }
        }
      })


      .state('twerk-config', {
        views: {
          content: {
            templateUrl: '/views/twerk-config.html'
          }
        }
      })







  }
);