// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let fs = require('fs');
let wav = require('node-wav');
let Visualization = require('./app/Visualization.js');
let Effects = require('./app/AudioEffect');

// Inputs

let INPUT_FILE = "./example.wav";
let WIDTH = 1000;
let HEIGHT = 1000;

let GAIN = 1;
let LPF_THRESHOLD = 440;
let LPF_BUFFER = 1000;

// View

const holder = document.getElementById('holder')
holder.ondragover = () => {
  return false;
}
holder.ondragleave = holder.ondragend = () => {
  return false;
}
holder.ondrop = (e) => {
  e.preventDefault()
  for (let f of e.dataTransfer.files) {
    INPUT_FILE = f.path;
    $("#file-info").html(INPUT_FILE)
  }
  return false;
}

$("#run-button").on("click",run);
$("#width-input").change(function() {
  WIDTH = $( this ).val();
});
$("#height-input").change(function() {
  HEIGHT = $( this ).val();
});
$("#gain-input").change(function() {
  GAIN = $( this ).val();
});
$("#LPF-threshold").change(function() {
  LPF_THRESHOLD = $( this ).val();
});
$("#LPF-buffer").change(function() {
  LPF_BUFFER = $( this ).val();
});

// FUNCTIONS

// Run (test)

function run() {
  console.log("Loading input file...");
  let result = loadWav(INPUT_FILE);
  let left = result.channelData[0].slice();
  let right = result.channelData[1].slice();

  left = applyEffects(left, [new Effects.Gain(GAIN), new Effects.lowpassFIR(LPF_THRESHOLD, LPF_BUFFER)]);
  right = applyEffects(right, [new Effects.Gain(GAIN), new Effects.lowpassFIR(LPF_THRESHOLD, LPF_BUFFER)]);

  // Render visualization of the waveform

  console.log("Visualizing left channel...");
  Visualization.visualizeWaveform(left, WIDTH, HEIGHT, './output/left.png');
  console.log("Visualizing right channel...");
  Visualization.visualizeWaveform(right, WIDTH, HEIGHT, './output/right.png');

  // Write the processed wave file

  console.log("Writing output file...")
  let output = Array();
  output[0] = left;
  output[1] = right;
  writeWav(output, result.sampleRate);
  console.log("Complete");
}

// Load a .wav file
function loadWav(file) {
  let buffer = fs.readFileSync(file);
  let result = wav.decode(buffer);
  return result;
}

// Write the processed wave file

function writeWav(PCMData, sampleRate) {
  let output = wav.encode(PCMData, { sampleRate: sampleRate, float: true, bitDepth: 16 });
  fs.writeFile("./output/" + 'output.wav', output, (err) => {
    if (err) throw err;
  });
}

// Apply audio effects

function applyEffects(PCMData, effectsList) {
  for (var i = 0; i < effectsList.length; i++) {
    console.log('Applying effect: ' + effectsList[i].toString());
    PCMData = effectsList[i].process(PCMData);
  }
  return PCMData;
}
