let fs = require('fs');
let pngC = require('node-png').PNG;

module.exports = class Image {
  constructor(width, height) {
    this.png = new pngC({
      height: height,
      width: width
    });
  }

  get width() {
    return this.png.width;
  }

  get height() {
    return this.png.height;
  }

  render(file) {
    this.png.pack().pipe(fs.createWriteStream(file));
  }

  insertPixel(x, y, r, g, b, a) {
    if (x >= this.png.width || y >= this.png.height) {
      return;
    }
    let idx = (this.png.width * y + x) * 4;
    this.png.data[idx] = r;
    this.png.data[idx + 1] = g;
    this.png.data[idx + 2] = b;
    this.png.data[idx + 3] = a;
  }
}
