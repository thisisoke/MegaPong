//might change to /watch
//open and connect the input socket
let socket = io('/output');

//listen for the confirmation of connection 
socket.on('connect', function(){
  console.log('output connected to server');
});

function setup(){
  createCanvas(windowWidth, windowHeight);
  background(0);

}

function draw(){

}

