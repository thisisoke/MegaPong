//open and connect the input socket
let socket = io('/pong');

//listen for the confirmation of connection 
socket.on('connect', function () {
  console.log('now connected to pong server');
});

let password = '6478019678';

//paddle 1 Position
var bar1X = 50;
var bar1Y = 200;
let buttonLeft;

//paddle 2 Position
var bar2X = -50;
var bar2Y = 200;
let buttonRight;

var barWidth = 40;
var barHeight = 100;

var xPos = 200;
var yPos = 200;
var xSpeed = 0;

var ballXspeed = 4;
var ballYspeed = 6;

var ballXpos = 300;
var ballYpos = 200;

var hit = false;
var hit2 = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  rectMode(CORNER);
  ellipseMode(CENTER);
  fill(255);

  bar2X = windowWidth - 50;

  //button Creation
  buttonLeft = createButton("Left Paddle");
  buttonLeft.mouseClicked(setPaddleControlToLeft);
  buttonLeft.size(100, 30);
  buttonLeft.style("font-family", "Bodoni");
  buttonLeft.style("font-size", "12px");
  buttonLeft.position((width/4)-50, 100);
  buttonLeft.style('colour:blue');

  buttonLeft = createButton("Right Paddle");
  buttonLeft.mouseClicked(setPaddleControlToRight);
  buttonLeft.size(100, 30);
  buttonLeft.style("font-family", "Bodoni");
  buttonLeft.style("font-size", "12px");
  buttonLeft.position(((width/4)*3)-50, 100);
  buttonLeft.style('colour:blue');



  // socket.on('ballPos', function (v) {


  //   ballXpos = v.ballX;
  //   ballYpos = v.ballY;
  //   //console.log(v.ballX, v.ballY, ballXpos, ballYpos )

  // });

  socket.on('paddlePos', function (v) {

    if (v.paddledControled == "Left") {
      bar1X = v.barX1Pos;
      bar1Y = v.barY1Pos;

    } else if (v.paddledControled == "Right") {

      bar2X = v.barX2Pos;
      bar2Y = v.barY2Pos;

    }

  });


}

var controledPaddle = "Right";
function setPaddleControlToLeft() {

  controledPaddle = "Left";

}

function setPaddleControlToRight() {

  controledPaddle = "Right";

}

function draw() {

  background(0);            // erase everything

  // draw grid
  for (var i = 0; i < width; i += 10) {

    stroke(39, 40, 41);
    strokeWeight(1);
    line(i, 0, i, height);
    line(width, i, 0, i);
    strokeWeight(0);

  }

  text("use your hand above the Leap Motion device", 20, 30);

  //Draw Middle Net
  let dashes = 6;
  let spaceQuo = height/dashes;
  let netXPos = width/2; 
  for (var i = 0; i < dashes; i ++) {
    strokeWeight(25);
    stroke(200);
    strokeCap(SQUARE);
    line(netXPos, (spaceQuo * i), netXPos, (spaceQuo*i)+100);
    strokeWeight(0);
  }

  if (ballXpos > width) {
    ballXspeed = -ballXspeed;
  }
  if (ballYpos > height) {
    ballYspeed = -ballYspeed;
  }
  if (ballXpos < 0) {
    ballXspeed = -ballXspeed;
  }
  if (ballYpos < 0) {
    ballYspeed = -ballYspeed;
  }

  ballXpos += ballXspeed;
  ballYpos += ballYspeed;

  let newBallPos = {
    ballX: ballXpos,
    ballY: ballYpos
  }



  var check = testBorder();
  if (check == false) {
    bar1X += xSpeed;

    // socket.emit('ballPos', newBallPos);

    // socket.on('ballPos', function (v) {


    //   ballXpos = v.ballX;
    //   ballYpos = v.ballY;
    //   //console.log(v.ballX, v.ballY, ballXpos, ballYpos )

    // });
  } else {
    xSpeed = 0;
  }


  rect(bar1X, bar1Y, barWidth, barHeight);
  rect(bar2X, bar2Y, barWidth, barHeight);
  ellipse(ballXpos, ballYpos, 30);
  hit = collideRectCircle(bar1X, bar1Y, barWidth, barHeight, ballXpos, ballYpos, 30);
  hit2 = collideRectCircle(bar2X, bar2Y, barWidth, barHeight, ballXpos, ballYpos, 30);





  if (hit == true) {
    ballXspeed = -ballXspeed;
  }
  if (hit2 == true) {
    ballXspeed = -ballXspeed;
  }




  let newBarPos;

  if (controledPaddle == "Left") {

    newBarPos = {
      paddledControled: controledPaddle,
      barX1Pos: bar1X,
      barY1Pos: bar1Y,
    }

  } else if (controledPaddle == "Right") {

    newBarPos = {
      paddledControled: controledPaddle,
      barX2Pos: bar2X,
      barY2Pos: bar2Y,

    }


  }


  socket.emit('paddlePos', newBarPos);
}


function testBorder() {
  var colission = false;
  if (bar1X > width - 60) {
    colission = true;
    bar1X = width - 60;
  }
  if (bar1X < 0) {
    colission = true;
    bar1X = 0;
  }
  return colission;
}

//----------------------------------------------------


var hand, finger;
var positionX = 0;
var positionY = 0;
var grab;

var options = { enableGestures: true };
console.log("running…");

Leap.loop(options, function (frame) {
  if (frame.hands.length > 0) {
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];
      positionX = hand.palmPosition[0];					// output x-coordinate of hand
      positionY = hand.palmPosition[1];					// output y-coordinate of hand
      grab = hand.grabStrength;
      //console.log("x: " +positionX);
      //console.log("spread: " +grab);
      //xSpeed += (positionX/500);
      //bar1X = positionX+(width/2);

      //bar1Y = -positionY + height;
      //console.log(positionX);
      if (controledPaddle === "Left") {
        bar1Y = map(positionY, 30, 500, windowHeight, 0);
        bar1X = map(positionX, -250, 250, 35, windowWidth / 3);
      } else if (controledPaddle === "Right") {

        bar2Y = map(positionY, 30, 500, windowHeight, 0);
        bar2X = map(positionX, -250, 250, (windowWidth / 3) * 2, (windowWidth - 35));

      }

    }
  }
});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



//Audio Connection 

// We use this to change the text of the "Connect" button to "Connected", and to disable that button after clicking it.
let connectButton = document.querySelector('.connectButton');

async function connectToHiFiAudio(stream) {
  // Disable the Connect button after the user clicks it so we don't double-connect.
  connectButton.disabled = true;
  connectButton.innerHTML = `Connecting...`;

  // Get the audio media stream associated with the user's default audio input device.
  let audioMediaStream;
  try {
    audioMediaStream = await navigator.mediaDevices.getUserMedia({ audio: HighFidelityAudio.getBestAudioConstraints(), video: false });
  } catch (e) {
    return;
  }

  // Set up the initial data for our user.
  // They'll be standing at the origin, facing "forward".
  let initialHiFiAudioAPIData = new HighFidelityAudio.HiFiAudioAPIData({
    position: new HighFidelityAudio.Point3D({ "x": 0, "y": 0, "z": 0 }),
    orientationEuler: new HighFidelityAudio.OrientationEuler3D({ "pitch": 0, "yaw": 0, "roll": 0 })
  });

  // Set up our `HiFiCommunicator` object, supplying our media stream and initial user data.
  let hifiCommunicator = new HighFidelityAudio.HiFiCommunicator({
    initialHiFiAudioAPIData: initialHiFiAudioAPIData
  });
  await hifiCommunicator.setInputAudioMediaStream(audioMediaStream);

  // Connect to the HiFi Audio API server!
  // Supply your own JWT here.
  const HIFI_AUDIO_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJkNTQ4OWMyZC1hNzdiLTRlNTYtOTNjNi01NmJlYTNhMzY3NDQiLCJ1c2VyX2lkIjoiSG9zdC0wMSIsInNwYWNlX2lkIjoiNDFiOWJiODUtNzQ3OC00YWY4LThhMDktNWJjMWYyNzJhMTZmIiwic3RhY2siOiJhdWRpb25ldC1taXhlci1hcGktaG9iYnktMDUifQ.4LP69t7GypGOKKFEQ9SEet1xhRAGRSTpQYhsbrPfCz0";
  try {
    await hifiCommunicator.connectToHiFiAudioAPIServer(HIFI_AUDIO_JWT);
  } catch (e) {
    console.error(`Error connecting to High Fidelity:\n${e}`);
    connectButton.disabled = false;
    connectButton.innerHTML = `Connection error. Retry?`;
    return;
  }

  // Show the user that we're connected by changing the text on the button.
  connectButton.innerHTML = `Connected!`;

  // Set the `srcObject` on our `audio` DOM element to the final, mixed audio stream from the High Fidelity Audio API Server.
  document.querySelector(`.outputAudioEl`).srcObject = hifiCommunicator.getOutputAudioMediaStream();
  // We explicitly call `play()` here because certain browsers won't play the newly-set stream automatically.
  document.querySelector(`.outputAudioEl`).play();
}