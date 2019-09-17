// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */
let video2;

// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;

  let bird;
  let leftgun;
  let rightgun;
  let left4;
  let right4;
  let congrats;
  let sad;
  let game = false;
  let game2 = false;
  let counter;
  let first;
    var num = 0;

  function preload() {
    leftgun = loadImage('leftgun.png');
    rightgun = loadImage('rightgun.png');
    left4 = loadImage('left4.png');
    right4 = loadImage('right4.png');
    bird = loadImage('bird.png');
    congrats = loadImage('win.gif');
    sad = loadImage('lose.gif');
  //  first = loadImage('image.jpg');
  }

function setup() {
  // Create a featureExtractor that can extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

  const canvas = createCanvas(windowWidth, windowHeight);

  // Put the canvas into the <div id="canvasContainer"></div>.
  canvas.parent('#canvasContainer')
  // Create a video element
  video2 = createCapture(VIDEO);
  video2.size(width, height);


  // Hide the video element, and just show the canvas
  video2.hide();
  // Create the UI buttons
  createButtons();
  noStroke();
  fill(255, 0, 0);
}

function draw() {
  // Flip the video from left to right, mirror the video
 //  translate(width, 0)
 //  scale(-1, 1);
 // image(video, 0, 0, width/4, height/4);

  gameSystem();

  if (num >= 10000){
    win();
  } else if (counter == 3000){
    lose();
  }

}

function gameSystem(){
  counter ++;

  if (game == true) {
    // background(255);
    background(255, 204, 0);
    drawLeft();
    num ++;
  }

  else if (game2 == true){

  background(120, 66, 245);
    drawRight();
    num ++;
  }



}

function drawRight(){
  //bird
    image(bird, width/2, height/2, 50, 50);
    image(bird, width/2, height/2.5, 50, 50);
    image(bird, width/2, height/3.5, 50, 50);
    image(bird, width/2, height/5.5, 50, 50);
  //gun
    image(rightgun, width/1.4, height/2.5, 120, 120);
    //hand
    image(left4, width/4.3, height/2.5, 120, 120);
}

function drawLeft(){
  //bird
    image(bird, width/3, height/2, 50, 50);
    image(bird, width/3, height/2.5, 50, 50);
    image(bird, width/3, height/3.5, 50, 50);
    image(bird, width/3, height/5.5, 50, 50);
  //gun
    image(right4, width/1.5, height/2.5, 120, 120);
    //hand
    image(leftgun, width/5.5, height/2.5, 120, 120);
}



function modelReady(){
  select('#status').html('Ready')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video2);

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('You need to add examples');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video2);

  // Use knnClassifier to classify which label do these features belong to
  knnClassifier.classify(features, gotResults);
  var firstpage = select('#firstpage');
  firstpage.hide();
}




// A util function to create UI buttons
function createButtons() {
  buttonA = select('#addClass1');
  buttonA.mousePressed(function() {
    var interval = setInterval(function() {
      // buttonA.trigger('click');
      addExample('Up');
    }, 500);

    setTimeout(function( ) {
      clearInterval( interval );
    }, 7000);
  });

 buttonB = select('#addClass2');
  buttonB.mousePressed(function() {
    var interval = setInterval(function() {
      addExample('Right');
    }, 500);

    setTimeout(function( ) {
      clearInterval( interval );
    }, 7000);

  });

  // Predict button

  buttonPredict = select('#buttonPredict');
   buttonPredict.mousePressed(classify);


  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllLabels);
}

function win(){
  print("win");
  //background(51, 10);
  //congrats.position(50, 350);
}
function lose(){
    print("lose");
//  background(51, 10);
//  sad.position(50, 350);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }


  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
    //  select('#confidence').html(`${confidences[result.label] * 100} %`);

      switch(result.label) {
        case 'Up':
          break;

        case 'Right':
          break;

        default:
          console.log(`Sorry, unknown label: ${result.label}`);
      }

  classify();
    }
  }
  if (result.label == 'Up'){
    game = true;
    game2 = false;
  } else if (result.label == 'Right'){
    game = false;
    game2 = true;
  }
  console.log("result" + result.label);
}

// Update the example count for each class
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#example1').html(counts['Up'] || 0);
  select('#example2').html(counts['Right'] || 0);

}

// Clear the examples in one class
function clearLabel(classLabel) {
  knnClassifier.clearLabel(classLabel);
  updateCounts();
}

// Clear all the examples in all classes
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
