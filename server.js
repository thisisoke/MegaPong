//create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server is listening at port: ', port);
});

//where we look for files
app.use(express.static('public'));

//create socket connection
let io = require('socket.io').listen(server)

//clients
var inputs = io.of('/')
//listen for anyone connecting
inputs.on('connection', function (socket) {
  console.log('new input client!: ' + socket.id);

  socket.on('dragTo', function (bag) {
  
    inputs.emit('dragFrom', bag);
    output.emit('dragFrom', bag);
  })

  //listen for this client to disconnect
  socket.on('disconnect', function () {
    console.log('this client disconnected: ' + socket.id);
  });

});

//pong
var pongInput = io.of('/pong')
//listen for anyone connecting
pongInput.on('connection', function (socket) {
  console.log('new pong input client!: ' + socket.id);

  socket.on('ballPos', function (v) {
  
    pongInput.emit('ballPos', v);
    //console.log(v);
  })

  //listen for this client to disconnect
  socket.on('disconnect', function () {
    console.log('this pong client disconnected: ' + socket.id);
  });

});

//output
var output = io.of('/output');
//listen
output.on('connection', function (socket) {
  console.log('new output client!: ' + socket.id);


  //listen for this client to disconnect
  socket.on('disconnect', function () {
    console.log('this client disconnected: ' + socket.id);
  });

});