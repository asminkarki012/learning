const crypto = require("crypto");
const tar = require("tar-stream");
const zlib = require("zlib");

const cipherAlogrithm = process.argv[2];
const initializationVector = process.argv[4];
const key = process.argv[3];

const deciper = crypto.createDecipheriv(
  cipherAlogrithm,
  key,
  initializationVector
);

const extract = tar.extract();

extract.on("entry", (headers, stream, next) => {
  const hash = crypto.createHash("md5");
  const chunks = [];
  stream.on("data", function (buf) {
    if (buf) chunks.push(buf);
  });

  stream.on("end", function () {
    const filecontent = Buffer.concat(chunks);
    if (filecontent.length) {
      const filehash = hash.update(filecontent).digest("hex");
      const result = `${filehash} ${headers.name}\n`;
      process.stdout.write(result);
    }
    next();
  });

  stream.resume();
});

process.stdin.pipe(deciper).pipe(zlib.createGunzip()).pipe(extract);
