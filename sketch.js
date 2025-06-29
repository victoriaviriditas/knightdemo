let video, handpose, predictions = [];
let knightImg, knightCanvas, knightCtx;

function preload() {
  knightImg = loadImage('knightblackwhite.png'); // full-res grayscale
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO).size(640, 480).hide();
  handpose = ml5.handpose(video, () => console.log('Ready'));
  handpose.on('predict', r=> predictions = r);

  // Canvas for dithering
  knightCanvas = createGraphics(knightImg.width, knightImg.height);
  knightCtx = knightCanvas.canvas.getContext('2d');
}

function draw() {
  background(0);
  let movement = 0;

  if (predictions.length>0) {
    const {landmarks} = predictions[0];
    const idx = landmarks[8];
    movement = dist(idx[0],idx[1], video.width/2, video.height/2);

    const dotSize = map(movement, 0, 200, 2, 10);
    const algorithm = (movement>150) ? 'atkinson' : 'ordered';

    knightCanvas.image(knightImg, 0, 0);
    const imgEl = knightCanvas.elt;
    ditherjs.dither(imgEl, {algorithm, step: dotSize});
    image(knightCanvas, width/2, height/2, knightCanvas.width/2, knightCanvas.height/2);
  } else {
    if (frameCount % 30 === 0) applyIdleDither();
    image(knightCanvas, width/2, height/2);
  }
}

function applyIdleDither() {
  knightCanvas.image(knightImg, 0, 0);
  ditherjs.dither(knightCanvas.elt, {algorithm: 'ordered', step: 3});
}

  } else {
    // Idle: show lightly dithered knight in center
    image(knightImages[0], width / 2, height / 2);
  }
}
