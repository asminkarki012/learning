const { Readable } = require("stream");

class MyStream extends Readable {
  constructor(data, options) {
    super(options)
    this.data = data;
  }
  _read() {
    this.push(this.data);
    this.push(null);
  }
}

const data = process.argv[2];
const myStream = new MyStream(data);

myStream._read(data);
myStream.pipe(process.stdout);
