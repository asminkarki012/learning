const http = require("http");
const through = require("through2");
const { Transform } = require("stream");

class UpperCaseTransform extends Transform {
  _transform(buf, _, next) {
    const data = buf.toString().toUpperCase();
    this.push(data);
    next();
  }
}

const server = http.createServer(function (req, res) {
  if (req.method === "POST") {
    //using through2 method
    // req
    //   .pipe(
    //     through(function (buf, _, next) {
    //       const data = buf.toString().toUpperCase();
    //       this.push(data);
    //       next();
    //     })
    //   )
    //   .pipe(res);
    req.pipe(new UpperCaseTransform()).pipe(res);
  } else res.end("send me a POST request\n");
});

const PORT = process.argv[2] || 9001;
server.listen(PORT, () => {
  console.log("server listening at ", PORT);
});
