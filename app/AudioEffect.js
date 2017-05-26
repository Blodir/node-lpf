let CircularBuffer = require('./strc/CircularBuffer.js').CircularBuffer;
let Visualization = require('./Visualization.js');

class AudioEffect {
  constructor() {
    this.name = "AudioEffect";
  }
  toString() {
    return "AudioEffect";
  }
  process(PCMData) {
    return PCMData;
  }
}

// Increase amplitude = 0...1
// Decrease amplitude = 1...n
class Gain extends AudioEffect {
  constructor(amount) {
    super();
    this.amount = amount;
  }
  toString() {
    return "Gain (" + this.amount + ")";
  }
  process(PCMData) {
    for (var i = 0; i < PCMData.length; i++) {
      let sample = PCMData[i];
      PCMData[i] = sample / this.amount;
    }
    return PCMData;
  }
}

// FIR (Finite Impulse Response) based LPF (Low Pass Filter)

class lowpassFIR extends AudioEffect {
  constructor(threshold, bufferSize) {
    super();
    this.bufferSize = bufferSize;
    this.cb = new CircularBuffer(this.bufferSize);
    this.threshold = threshold;
    this.weight = threshold / 44100;
  }
  toString() {
    return "Lowpass";
  }
  process(PCMData) {
    let sincArray = new Array(this.bufferSize);

    for (var i = 0; i < this.bufferSize; i++) {
      let x = 2 * Math.PI * this.weight * (i - Math.round(this.bufferSize / 2));
      let sinc = 0;
      if (x === 0) {
        sinc = 1;
      } else {
        sinc = Math.sin(x) / x;
      }
      sincArray[i] = sinc;
    }

    for (var i = 0; i < PCMData.length; i++) {
      this.cb.add(PCMData[i]);
      let sum = 0;
      for (var j = 0; j < this.bufferSize; j++) {
        sum += this.cb.array[this.cb.getRelativeIndex(j)] * sincArray[j];
      }
      PCMData[i] = sum * this.threshold / 20000;
    }
    /* Visualize Sinc Array */
    Visualization.visualizeWaveform(sincArray, this.bufferSize, 1000, './output/coefficients.png');

    return PCMData
  }
}

module.exports.AudioEffect = AudioEffect;
module.exports.Gain = Gain;
module.exports.lowpassFIR = lowpassFIR;
