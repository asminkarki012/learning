const isString = (val) => {
  return val && typeof val === "string";
};

const calculator = (val) => {
  const operations = {
    "*": (a, b) => a * b,
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "/": (a, b) => parseInt(a / b),
  };

  const operatorMatch = val.match(/[\*\+\-\/]/);
  const operator = operatorMatch[0];
  const [operand2, operand1] = val.split(operatorMatch).map(Number);
  console.log("operand2 operand1", operand2, operand1);
  const operation = operations[operator];
  return operation(operand2, operand1);
};
function zero(val) {
  if (isString(val)) {
    return calculator("0" + val);
  } else {
    return 0;
  }
}

function one(val) {
  if (isString(val)) {
    return calculator("1" + val);
  } else {
    return 1;
  }
}

function two(val) {
  if (isString(val)) {
    return calculator("2" + val);
  } else {
    return 2;
  }
}

function three(val) {
  if (isString(val)) {
    return calculator("3" + val);
  } else {
    return 3;
  }
}

function four(val) {
  if (isString(val)) {
    return calculator("4" + val);
  } else {
    return 4;
  }
}
function five(val) {
  if (isString(val)) {
    return calculator("5" + val);
  } else {
    return 5;
  }
}

function six(val) {
  if (isString(val)) {
    return calculator("6" + val);
  } else {
    return 6;
  }
}

function seven(val) {
  if (isString(val)) {
    return calculator("7" + val);
  } else {
    return 7;
  }
}

function eight(val) {
  if (isString(val)) {
    return calculator("8" + val);
  } else {
    return 8;
  }
}

function nine(val) {
  if (isString(val)) {
    return calculator("9" + val);
  } else {
    return 9;
  }
}
function plus(val) {
  return `+${val}`;
}
function minus(val) {
  return `-${val}`;
}
function times(val) {
  return `*${val}`;
}
function dividedBy(val) {
  return `/${val}`;
}

// console.log(seven(times(five()))); //result 35

console.log(seven(plus(four())));
console.log(three(minus(four())));
