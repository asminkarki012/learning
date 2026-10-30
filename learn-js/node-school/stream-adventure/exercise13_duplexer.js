//exercise 13
const { spawn } = require("child_process");
const duplexer = require("duplexer2");

//TODO: Rewrite using native nodejs module i.e Duplex;
module.exports = function (cmd, args) {
  // spawn the process and return a single stream
  // joining together the stdin and stdout here
  const spawnedChild = spawn(cmd, args);
  return duplexer(spawnedChild.stdin, spawnedChild.stdout);
};
