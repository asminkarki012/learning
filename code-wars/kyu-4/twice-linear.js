// https://www.codewars.com/kata/5672682212c8ecf83e000050
//todo
function dblLinear(n) {
  const pushState = [1];
  let count = 0;
  const uniqueElement = new Set();
  while (count < n) {
    const yState = calculateY(pushState[count]);
    const zState = calculateZ(pushState[count]);

    if (!uniqueElement.has(yState)) {
      if (yState < zState) {
        pushState.push(yState);
      }
      uniqueElement.add(yState);
    }
    if (!uniqueElement.has(zState)) {
      pushState.push(zState);
      uniqueElement.add(zState);
    }
    // pushState.push(yState, zState);
    count++;
  }
  return pushState[n];
  // return [...new Set(pushState)][n];
}

function calculateY(x) {
  return 2 * x + 1;
}
function calculateZ(x) {
  return 3 * x + 1;
}
//u = [1, 3, 4, 7, 9, 10, 13, 15, 19, 21, 22, 27, ...]
// console.log(dblLinear(10)); //output:22
// console.log(dblLinear(20)); //57;
console.log(dblLinear(100)); //447
