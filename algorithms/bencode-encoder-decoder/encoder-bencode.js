function encodeBencode(encode) {
  if (typeof encode === "number") {
    return encodeInteger(encode);
  } else if (typeof encode === "string") {
    return encodeString(encode);
  } else if (Array.isArray(encode)) {
    return encodeList(encode);
  } else if (typeof encode === "object") {
    return encodeDict(encode);
  }
}

const encodeInteger = (encode) => {
  return `i${encode}e`;
};

const encodeString = (encode) => {
  return `${encode.length}:${encode}`;
};

const encodeList = (encode) => {
  const result = encode.reduce((acc, curr, index) => {
    return (acc += encodeBencode(curr));
  }, "");
  return `l${result}e`;
};

const encodeDict = (encode) => {
  const result = Object.entries(encode)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .reduce((acc, [key, value], index) => {
      return (acc += encodeBencode(key) + encodeBencode(value));
    }, "");
  return `d${result}e`;
};

module.exports = encodeBencode;
