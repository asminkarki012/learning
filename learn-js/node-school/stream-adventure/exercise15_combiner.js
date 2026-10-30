const { Readable, Transform, pipeline } = require("stream");
const zlib = require("zlib");
const fs = require("fs");

module.exports = function () {
  const input = this.inputStdin;
  const readable = new MyReadableStream({ objectMode: true }, input);
  const transform = new MyTransformStream({ objectMode: true });
  const gzip = zlib.createGzip();

  return pipeline(readable, transform, gzip, (err) => {
    console.error("errr", err);
  });
};

class MyReadableStream extends Readable {
  constructor(options, input) {
    super(options);
    this.input = input;
    this.pos = 0;
  }

  _read() {
    if (this.pos >= this.input.length) {
      this.push(null);
      return;
    }
    const item = JSON.parse(this.input[this.pos]);
    this.pos++;
    this.push(item);
  }
}

class MyTransformStream extends Transform {
  constructor(options) {
    super(options);
    this.currGenre = null;
    this.books = [];
  }
  _transform(chunk, encoding, next) {
    const { type, name } = chunk;
    if (type === "genre") {
      if (this.currGenre) {
        this.books.push(this.currGenre);
        this.currGenre = null;
      }
      this.currGenre = { name, books: [] };
    } else if (type === "book") {
      this.currGenre.books.push(name);
    }
    next();
  }

  _flush(done) {
    if (this.currGenre) {
      this.books.push(this.currGenre);
    }
    this.push(JSON.stringify(this.books));
    done(); // Signal the end of the stream
  }
}
