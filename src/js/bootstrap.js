
require("exports?angular!angular");
require('angular-ui-router');
require('angular-ui-bootstrap');
require('./controllers/controllers');
require('./directives/directives');
module.exports = angular.module('NS', [
  'ui.router',
  'ui.bootstrap',
  'NS.controllers',
  'NS.directives'
])

.config([
    '$stateProvider'
  , '$urlRouterProvider'
  , '$locationProvider'
  , function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    if(window.history && window.history.pushState) {
      $locationProvider.html5Mode({enabled: true});
    }
  }])


.run(['$state', '$rootScope', '$modal', 
  function($state, $rootScope, $modal) {
  
  ////////////////////////
  // Load global settings
  ////////////////////////
  $rootScope.env = window.env || {};

  // expose ui state to entire app
  $rootScope.$state = $state;
  function stateNameInjector (name) {
    $('body').toggleClass(name);
  }

  stateNameInjector($state.current.name);

}])