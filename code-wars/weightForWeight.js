function orderWeight(strng) {
  const splitString = strng.split(" ");
  console.log(splitString);
  const sumOfDigit = splitString.sort((a, b) => a - b).map((digit) => {
    const digitSum = digit.split("").reduce((a, curr) => a + Number(curr), 0);
    return { digitSum, digit };
  })

  return sumOfDigit.sort((a, b) => {
    if (a.digitSum !== b.digitSum) {
      return a.digitSum - b.digitSum;
    } else {
      console.log("a b",a,b,a.toString().localeCompare(b.toString()))
      return a.digit.toString().localeCompare(b.digit.toString());
    }
  }).map(x => x.digit).join(" ").toString();
}
console.log(orderWeight("103 123 4444 99 2000")) // "2000 103 123 4444 99"
console.log(orderWeight("2000 10003 1234000 44444444 9999 11 11 22 123"))
