
// console.log(angular.module);


// require('../css/style.scss');
require('./bootstrap');
require('./states');
require('./live');


var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});