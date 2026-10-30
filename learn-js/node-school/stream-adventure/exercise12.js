const trumpet = require("trumpet");
const through2 = require("through2");
const tr = trumpet();

const stream = tr.select(".loud").createStream();
// stream.on("data",(chunk)=>{
//  stream.write(chunk.toString().toUpperCase());
// })
//
// stream.on("end",(chunk)=>{
//   stream.end()
// })

stream
  .pipe(
    through2(function (buf, _, next) {
      this.push(buf.toString().toUpperCase());
      next();
    })
  )
  .pipe(stream);

process.stdin.pipe(tr).pipe(process.stdout);
