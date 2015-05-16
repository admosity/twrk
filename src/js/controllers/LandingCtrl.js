

var module = require('./module');

module.controller('LandingCtrl', function($scope, $http, $modal) {

  $(window).scroll(function() {
    var scroll = $(window).scrollTop();

    //>=, not <=
    if (scroll >= 20) {
      $(".header").addClass("scroll-header");
    }
    else {
      $(".header").removeClass("scroll-header");
    }
  });

  $scope.joinTwerk = function (size, msg) {
    var modalInstance = $modal.open({
      templateUrl: '/views/partials/join-twerk-modal.html',
      size: size,
      windowClass: 'join-twerk-modal'
    });
  }

});
