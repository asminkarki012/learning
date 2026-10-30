const crypto = require("crypto");
const PASSPHRASE_KEY = process.argv[2];
const initializationVector = process.argv[3];
const encryptionAlogrithm = "aes256";
//initializationVector: used for generating randomness for same key
//hence better,unique and secure encrypted plain text is generated
const deciper = crypto.createDecipheriv(
  encryptionAlogrithm,
  PASSPHRASE_KEY,
  initializationVector
);
process.stdin.pipe(deciper).pipe(process.stdout);
