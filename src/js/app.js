
// console.log(angular.module);


// require('../css/style.scss');
require('./bootstrap');
require('./states');
require('./live');


var socket = io.connect('http://localhost:3000/');
socket.on('connect', function (data) {
  console.log("CONNECT RESPONSE");
  socket.emit('update', { my: 'data' });
});

socket.on('reply', function (data) {
  console.log("UPDATE RESPONSE", data);
});