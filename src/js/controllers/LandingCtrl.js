

var module = require('./module');

module.controller('LandingCtrl', function($scope, $http, $modal) {

  $scope.joinTwerk = function (size, msg) {
    var modalInstance = $modal.open({
      templateUrl: '/views/partials/join-twerk-modal.html',
      size: size,
      windowClass: 'join-twerk-modal'
    });
  }

});
