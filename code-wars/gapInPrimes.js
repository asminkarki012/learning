//done
function gap(g, m, n) {
  for (let i = m; i <= n - g; i++) {
    if (isPrime(i) && isPrime(i + g) && isSquential(i, i + g)) {
      return [i, i + g];
    }
  }
  return null;
}

function isPrime(num) {
  if (num < 2) return false;
  const sqrtNum = Math.floor(Math.sqrt(num));
  for (let i = 2; i <= sqrtNum; i++) {
    if (num % i == 0) return false;
  }
  return true;
}

function isSquential(lowerNum, upperNum) {
  for (let i = lowerNum + 1; i < upperNum; i++) {
    if (isPrime(i)) return false;
  }
  return true;
}
// console.log(gap(2, 100, 110));
// result:[101, 103]
console.log(gap(6, 100, 110));
// console.log(gap(10, 300, 400));
// console.log(isSquential(359, 367));
