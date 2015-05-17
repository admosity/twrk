

var module = require('./module');

module.controller('CalibrateCtrl', function($scope, $http, $modal, $state) {
  var start = false;
  $scope.calibrate1Show = true;
  $scope.calibrate2Show = false;

  $scope.calibrate1 = function(){
    $scope.calibrate1Show = false;
    $scope.calibrate2Show = true;
    start = true;
    //This doesnt actually do anything yet
    
  }
  $scope.calibrate2 = function(){
    $scope.calibrate1Show = false;
    $scope.calibrate2Show = false;
    //This doesnt actually do anything yet

    $state.go('twerk-do');
  }
});
