//used brute force another method is finding arithemtic sum for triangle number and then finding divisors
const findTriangleNumber = (nth) => {
  let sum = 0;
  for (let i = 1; i <= nth; i++) {
    sum += i;
  }
  return sum;
};

const findDivisors = (triangleNumber) => {
  const divisors = [];
  for (let i = 1; i <= triangleNumber; i++) {
    if (triangleNumber % i === 0) {
      divisors.push(i);
    }
  }
  return divisors;
};
let count = 10000;
while (count <= 100000000) {
  const nthTriangleNumber = findTriangleNumber(count);
  const divisors = findDivisors(nthTriangleNumber);
  let tempDiv = 0;
  if (divisors.length > tempDiv) {
    tempDiv = divisors.length;
    console.log(
      "divisors nth TriangleNumber",
      divisors.length,
      nthTriangleNumber
    );
  }
  if (divisors.length >= 500) {
    console.log(
      "500 reached nthTriangleNumber",
      divisors.length,
      nthTriangleNumber
    );
    break;
  }

  count += 1;
}
