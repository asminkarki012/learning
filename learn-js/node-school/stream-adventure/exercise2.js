const fs = require('fs');
const process = require('process')
const file = process.argv[2];
fs.createReadStream(file).pipe(process.stdout);
