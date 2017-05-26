class CircularBuffer {
  constructor(length) {
    this._array = new Array();
    this.first = 0;
    for (var i = 0; i < length; i++) {
      this.array[i] = 0;
    }
  }
  get array() {
    return this._array;
  }
  set array(a) {
    this._array = a;
  }

  // Returns an index relative to the starting index of the circular buffer

  getRelativeIndex(i) {
    let r = this.first - i;
    if (r < 0) {
      r += this.array.length;
    }
    return r;
  }
  sum() {
    let sum = 0;
    for (var i = 0; i < this.array.length; i++) {
      sum += this.array[i];
    }
    return sum;
  }
  add(value) {
    // replace value in first index
    this.array[this.first] = value;

    if (this.first === this.array.length - 1) {
      this.first = 0;
    } else {
      this.first++;
    }
  }
}

module.exports.CircularBuffer = CircularBuffer;
