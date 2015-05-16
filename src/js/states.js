
module = require('./bootstrap');

module.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider

      .state('landing', {
        url: '/',
        views: {

          'content': {
            controller: "LandingCtrl",
            templateUrl: "/views/landing.html"
          },

        }
      }); // last state

  }
]);