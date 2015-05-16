

var module = require('./module');

module.controller('WatchCtrl', function($scope, $http, $modal) {

  console.log("WATCH DAT TWERK");




  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  function drawLine(x, y, z, m){
    var cX = x;// / 2 + y / 2;
    var cY = z;
    var mag = m * 10;
    
    context.beginPath();
    context.moveTo(400, 300);
    context.lineTo(400 + cX * mag, 300 + cY * mag);
    context.stroke();
  }

  var lp = 0.2;
  var lpX = 0;
  var lpY = 0;
  var lpZ = 0;



  var socket = io.connect(window.SERVER_URL);
  socket.on('connect', function (data) {
    console.log("CONNECT RESPONSE");
  });

  socket.on('reply', function (data) {
    console.log("UPDATE RESPONSE", data);

    console.log(data);
    var vector = data.data.split(',');
    lpX = (vector[0] * (1-lp)) + (lpX * lp);
    lpY = (vector[1] * (1-lp)) + (lpY * lp);
    lpZ = (vector[2] * (1-lp)) + (lpZ * lp);
    context.clearRect ( 0 , 0 , canvas.width, canvas.height );
    context.strokeStyle = 'rgba(255, 0, 0, 0.6)';
    drawLine(vector[0],vector[1],vector[2],vector[6]);
    context.strokeStyle = '#0000ff';
    drawLine(vector[3],vector[4],vector[5],vector[6]);
    context.strokeStyle = '#00ff00';
    drawLine(lpX, lpY, lpZ, vector[6]);
    
  });

  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  function drawLine(x, y, z, m){
    var cX = -(x/Math.abs(x) * (Math.abs(x / 2) + Math.abs(y / 2)));
    var cY = z;
    var mag = m * 25;
    
    context.beginPath();
    context.lineWidth = 15;
    context.moveTo(400, 300);
    context.lineTo(400 + cX * mag, 300 + cY * mag);
    context.stroke();
  }
  var lp = 0.2;
  var lpX = 0;
  var lpY = 0;
  var lpZ = 0;

});