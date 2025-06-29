let handpose;
let video;
let predictions = [];
let knightImages = [];
let currentDitherLevel = 0;
let maxMovement = 100;

function preload() {
  for (let i = 0; i < 4; i++) {
    knightImages[i] = loadImage("knight_dither_" + i + ".png");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  handpose = ml5.handpose(video, () => {
    console.log("Handpose ready!");
  });
  
  handpose.on("predict", results => {
    predictions = results;
  });
  
  imageMode(CENTER);
}

function draw() {
  background(0);

  let movement = 0;
  if (predictions.length > 0) {
    const hand = predictions[0];
    const indexFinger = hand.landmarks[8]; // tip of index finger

    // Map hand movement to knight motion
    let x = map(indexFinger[0], 0, video.width, width / 2 - 50, width / 2 + 50);
    let y = map(indexFinger[1], 0, video.height, height / 2 - 50, height / 2 + 50);
    
    // Calculate movement intensity
    movement = dist(indexFinger[0], indexFinger[1], video.width / 2, video.height / 2);
    currentDitherLevel = int(map(movement, 0, maxMovement, 0, 3));
    currentDitherLevel = constrain(currentDitherLevel, 0, 3);
    
    image(knightImages[currentDitherLevel], x, y);
  } else {
    // Idle: show lightly dithered knight in center
    image(knightImages[0], width / 2, height / 2);
  }
}
