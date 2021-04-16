 //open and connect the input socket
 let socket = io('/');

 //listen for the confirmation of connection 
 socket.on('connect', function(){
   console.log('now connected to server');
 });
 
 let socketColor = {};
 
 function setup(){
   createCanvas(windowWidth, windowHeight);
   background(0);
   
   socketColor = {
     sRed: random(50, 255),
     sGreen: random(50,255),
     sBlue: random(50, 255)
   }
   
   socket.on('dragFrom', function(bag){
     fill(bag.sColor.sRed, bag.sColor.sGreen, bag.sColor.sBlue);
     ellipse(bag.mX, bag.mY, 50, 50);
   });
 }
 
 function draw(){
 
 }
 
 function mouseDragged(){
   // ellipse(mouseX, mouseY, 30, 30);
   let bag ={
     mX: mouseX,
     mY: mouseY,
     sColor: socketColor
   }
   socket.emit('dragTo', bag);
   console.log(bag);
 }