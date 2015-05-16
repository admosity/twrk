

var module = require('./module');

module.controller('CalibrateCtrl', function($scope, $http, $modal, $state) {
  var start = false;
  $scope.calibrate1Show = true;
  $scope.calibrate2Show = false;

  $scope.calibrate1 = function(){
    $scope.calibrate1Show = false;
    $scope.calibrate2Show = true;
    start = true;
    
  }
  $scope.calibrate2 = function(){
    $scope.calibrate1Show = false;
    $scope.calibrate2Show = false;


    $state.go('twerk-do');
  }
});
