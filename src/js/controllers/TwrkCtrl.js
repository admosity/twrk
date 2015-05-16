var module = require('./module');

module.controller('TwrkCtrl', function($scope, $http, $modal) {

  $scope.chooseAvatar = function (size, msg) {
    var modalInstance = $modal.open({
      templateUrl: '/views/partials/avatar-modal.html',
      size: size,
      windowClass: 'avatar-modal',
      resolve: {
        topScope: function() {
          return $scope;
        }
      },
      controller: function($scope, $modalInstance, topScope) {
        $scope.chooseMyAvatar = function(avatar) {
          topScope.avatar = avatar;
          $modalInstance.close();
        };
      }
    });
  }

  var dataContainerOrientation = document.getElementById('dataContainerOrientation');
  var dataContainerMotion = document.getElementById('dataContainerMotion');
  var dataContainerAcceleration = document.getElementById('dataContainerAcceleration');

  // var socket = io.connect(window.SERVER_URL);
  // socket.on('connect', function (data) {
  //   console.log("CONNECT RESPONSE");
  //   socket.emit('update', { my: 'data' });
  // });

  // socket.on('reply', function (data) {
  //   console.log("UPDATE RESPONSE", data);
  // });

  if(window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    var connected = false;
    //Socket stuff
    var socket = io.connect(window.SERVER_URL);
    socket.on('connect', function (data) {
      connected = true;
      socket.emit('join', { username: "USERNAME", avatar: 5 });
    });

    function sendServer(data){
      if(connected)
        socket.emit('update', { data: data });
    }
    // socket.on('reply', function (data) {
    //   console.log("UPDATE RESPONSE", data);
    // });

    //Maths
    function mult(m13, m33){
      return [
        m33[0][0] * m13[0] + m33[0][1] * m13[1] + m33[0][2] * m13[2],
        m33[1][0] * m13[0] + m33[1][1] * m13[1] + m33[1][2] * m13[2],
        m33[2][0] * m13[0] + m33[2][1] * m13[1] + m33[2][2] * m13[2]
      ];
    }
    var xRotation = function(theta){
      return [
        [1, 0, 0],
        [0, Math.cos(theta), -Math.sin(theta)],
        [0, Math.sin(theta), Math.cos(theta)],
      ];
    }
    var yRotation = function(theta){
      return [
        [Math.cos(theta), 0, Math.sin(theta)],
        [0, 1, 0],
        [-Math.sin(theta), 0, Math.cos(theta)],
      ];
    }
    var zRotation = function(theta){
      return [
      [Math.cos(theta), -Math.sin(theta), 0],
      [Math.sin(theta), Math.cos(theta), 0],
      [0, 0, 1],
      ];
    }
    var rad = function(deg){
      return Math.PI / 180 * deg;
    }
    var rotateYPR = function(vector, yaw, pitch, roll){
      var x = vector;
      //Intrinsic Rotation
      x =         mult(x, yRotation(rad(roll)));
      x =         mult(x, xRotation(rad(pitch)));
      return    mult(x, zRotation(rad(yaw)));
      //Extrinsic Rotation
      // x =    mult(x, yRotation(rad(yaw)));
      // x =    mult(x, xRotation(rad(pitch)));
      // return mult(x, yRotation(rad(roll)));
    }

    //Find our div containers in the DOM
    var roll, pitch, yaw;

    var vX = 0, vY = 0, vZ = 0;
    var gX = 0, gY = 0, gZ = 0;
    var sampleCount = 0;

    window.addEventListener('deviceorientation', function(event) {
      yaw = event.alpha;
      pitch = event.beta;
      roll = event.gamma;

      if(yaw!=null || pitch!=null || roll!=null) {
        dataContainerOrientation.innerHTML = 'yaw: ' + yaw + '<br/>pitch: ' + pitch + '<br />roll: ' + roll + '<br />';
      }
    }, false);

    highestMagnitude = 0;
    window.addEventListener('devicemotion', function(event) {
      var x = event.acceleration.x;
      var y = event.acceleration.y;
      var z = event.acceleration.z;

      var x2 = event.accelerationIncludingGravity.x;
      var y2 = event.accelerationIncludingGravity.y;
      var z2 = event.accelerationIncludingGravity.z;
      //accelerationIncludingGravity
      var magnitude = Math.sqrt(x*x + y*y + z*z);
      //x /= magnitude;
      //y /= magnitude;
      //z /= magnitude;

      highestMagnitude = Math.max(highestMagnitude, magnitude);

      var r = event.rotationRate;
      var html = 'Acceleration:<br />';
      html += 'x: ' + x +'<br />y: ' + y + '<br/>z: ' + z+ '<br />Magnitude' + magnitude + '<br />Highest' + highestMagnitude + '<br />';
      html += 'Rotation rate:<br />';
      if(r!=null) html += 'alpha: ' + r.alpha +'<br />beta: ' + r.beta + '<br/>gamma: ' + r.gamma + '<br />';
      dataContainerMotion.innerHTML = html;

      //Threshold check
      if(magnitude > 1){
        vX += x;
        vY += y;
        vZ += z;
        gX += x2 - x;
        gY += y2 - y;
        gZ += z2 - z;
        sampleCount++;
      }
    });

    function sendData(){
      if(sampleCount > 0){
        vX /= sampleCount;
        vY /= sampleCount;
        vZ /= sampleCount;

        gX /= sampleCount;
        gY /= sampleCount;
        gZ /= sampleCount;

        var mg = rotateYPR([gX, gY, gZ], yaw, pitch, roll);
        var thetaX = Math.atan2(mg[1], mg[2]);
        var thetaY= Math.atan2(mg[0], mg[2]);

        var m = rotateYPR([vX, vY, vZ], yaw, pitch, roll);

        //m = mult(m, xRotation(thetaX));
        //m = mult(m, yRotation(thetaY));

        var magnitude = Math.sqrt(m[0]*m[0] + m[1]*m[1] + m[2]*m[2]);
        m[0] /= magnitude;
        m[1] /= magnitude;
        m[2] /= magnitude;
        dataContainerAcceleration.innerHTML = m[0] + "<br/>" + m[1] + "<br/>" + m[2];
        if(magnitude > 0.3){
          sendServer(m + "," + mg + "," + magnitude);
        }
      }
      sampleCount = 0;
      vX = 0;
      vY = 0;
      vZ = 0;
      gX = 0;
      gY = 0;
      gZ = 0;
    }
    setInterval(sendData, 150);
  }
});
