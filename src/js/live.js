require("exports?angular!angular");
var app = require('./bootstrap');
angular.element(document).ready(function() {
  angular.bootstrap(document,[app['name']]);
});