const concat = require("concat-stream");

process.stdin.pipe(
  concat(function (buf) {
    const line = buf.toString();
    const reverseLine = line.split("").reverse().join("");

    process.stdout.write(reverseLine);
  })
);
