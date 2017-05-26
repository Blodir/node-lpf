let Image = require('./Image.js');

module.exports.visualizeWaveform = function(PCMData, width, height, file) {
  let img = new Image(width, height);
  let prevSample = 0;
  for (var i = 0; i < width; i++) {
    PCMData[i] = drawWaveform(PCMData[i], i, prevSample, img);
    prevSample = PCMData[i];
  }
  img.render(file);
}

function drawWaveform(sample, time, prevSample, img) {
  let output = sample;
  let currentY = Math.round(sample * (img.height / 2)) + (img.height / 2);
  let prevY = Math.round(prevSample * (img.height / 2)) + (img.height / 2)

  img.insertPixel(time, currentY, 0, 0, 0, 255, img);

  if(prevY < currentY) {
    for (var i = 0; i < (currentY - prevY); i++) {
      img.insertPixel(time, currentY - i, 0, 0, 0, 255, img);
    }
  } else if(prevY > currentY) {
    for (var i = 1; i < (prevY - currentY); i++) {
      img.insertPixel(time - 1, currentY + i, 0, 0, 0, 255, img);
    }
  }

  return output;
}
