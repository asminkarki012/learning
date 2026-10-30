const { Duplex } = require("stream");
module.exports = function (counter) {
  // return a duplex stream to count countries on the writable side
  // and pass through `counter` on the readable side
  return new CountingDuplex({ objectMode: true }, counter);
};

class CountingDuplex extends Duplex {
  constructor(options, counter) {
    super(options);
    this.counts = {};
    this.counter = counter;
  }

  _write(chunk, endcoding, next) {
    const country = chunk.country || "";
    this.counts[country] = (this.counts[country] || 0) + 1;
    next();
  }

  _read(size) {
    //do nothing
    //size is 16 for objectMode:true
    console.log("size", size);
  }

  _final(done) {
    this.counter.on("data", (chunk) => {
      this.push(chunk);
    });
    this.counter.on("end", () => {
      this.push(null);
    });
    this.counter.setCounts(this.counts);
    done();
  }
}
