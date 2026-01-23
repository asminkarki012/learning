function productFib(prod) {
  const fibNum = [];
  const rootProd = Math.floor(Math.sqrt(prod));
  let isFibProduct = false;
  let index = 0;
  const result = [];
  for (let i = 0; i < rootProd; i += 2) {
    const laggingFib = findFib(i);
    fibNum.push(laggingFib);
    const leadingFib = findFib(i + 1);
    fibNum.push(leadingFib);
    finalProduct = fibNum[index] * fibNum[index + 1];
    if (fibNum[index] * fibNum[index - 1] === prod) {
      result.push(fibNum[index - 1], fibNum[index]);
      isFibProduct = true;
      break;
    } else if (fibNum[index] * fibNum[index - 1] > prod) {
      result.push(fibNum[index - 1], fibNum[index]);
      break;
    }

    index += 1;
  }
  return isFibProduct
    ? [result[0], result[1], true]
    : [result[0], result[1], false];
}

function findFib(nth) {
  let first = 0;
  let second = 1;
  let temp;
  if (nth <= 1) return nth;
  while (nth > 1) {
    temp = first + second;
    first = second;
    second = temp;
    nth--;
  }
  return second;
}
console.log(productFib(74049690));
// console.log(findFib(11));
