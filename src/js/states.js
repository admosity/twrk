
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
    function stateNameInjector (name) {
      return function() {
        $('body').toggleClass(name);
      }
    }
    $stateProvider

      .state('landing', {
        url: '/',
        views: {

          'content': {
            controller: "LandingCtrl",
            templateUrl: "/views/landing.html"
          },

        },
        onEnter: stateNameInjector('landing'),
        onExit: stateNameInjector('landing'),
      })

      .state('watch-twerk', {
        url: '/watch',
        views: {

          'content': {
            templateUrl: "/views/watch-twerk.html"
          },

        },

        onEnter: stateNameInjector('watch-twerk'),
        onExit: stateNameInjector('watch-twerk'),
      })

      .state('twerk-setup', {
        views: {

          'content': {
            templateUrl: "/views/twerk-setup.html"
          },

        },

        onEnter: stateNameInjector('twerk-setup'),
        onExit: stateNameInjector('twerk-setup'),
      })

      .state('twerk-calibrate', {
        views: {

          'content': {
            templateUrl: "/views/twerk-calibrate.html"
          },

        },

        onEnter: stateNameInjector('twerk-calibrate'),
        onExit: stateNameInjector('twerk-calibrate'),
      })

      .state('twerk-do', {
        views: {
          content: {
            templateUrl: '/views/twerk-do.html'
          }
        },

        onEnter: stateNameInjector('twerk-do'),
        onExit: stateNameInjector('twerk-do'),
      })


      .state('twerk-howto', {
        views: {
          content: {
            templateUrl: '/views/twerk-howto.html'
          }
        },

        onEnter: stateNameInjector('twerk-howto'),
        onExit: stateNameInjector('twerk-howto'),
      })


      .state('twerk-config', {
        views: {
          content: {
            templateUrl: '/views/twerk-config.html'
          }
        },

        onEnter: stateNameInjector('twerk-config'),
        onExit: stateNameInjector('twerk-config'),
      })







  }
);