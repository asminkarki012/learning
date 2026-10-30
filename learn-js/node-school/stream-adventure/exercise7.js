const split2 = require("split2");
const through2 = require("through2");
let countLine = 1;

process.stdin
  .pipe(
    through2(function (line, _, next) {
      const string =
        countLine % 2 === 0
          ? line.toString().toUpperCase()
          : line.toString().toLowerCase();

      this.push(string);
      countLine++;
      next();
    })
  )
  .pipe(process.stdout);
