const { Writable } = require("stream");

class MyStream extends Writable {
  _write(chunk, encoding, callback) {
    try {
      console.log("writing:", chunk.toString());
      callback(null);
    } catch (err) {
      callback(err)
    }

  }
}

const myStream = new MyStream();
process.stdin.pipe(myStream);
