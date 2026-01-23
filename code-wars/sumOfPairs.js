//done
function sumPairs(ints, s) {
  const seenNumbers = new Set();

  for (let i = 0; i < ints.length; i++) {
    const complement = s - ints[i];
    console.log("complement", complement);
    if (seenNumbers.has(complement)) {
      console.log(seenNumbers, i);
      return [complement, ints[i]];
    }

    seenNumbers.add(ints[i]);
  }

  return undefined;
}

console.log(sumPairs([4, 3, 2, 3, 4], 6));
// console.log(sumPairs([11, 3, 7, 5], 10));

// console.log(sumPairs([10, 5, 2, 3, 7, 5], 10));
// console.log(sumPairs([1, -2, 3, 0, -6, 1], -6)); //result: [0,-6]
// #          ^-----^         4 + 2 = 6, indices: 0, 2 *
// #             ^-----^      3 + 3 = 6, indices: 1, 3
// #                ^-----^   2 + 4 = 6, indices: 2, 4
// #  * the correct answer is the pair whose second value has the smallest index
// == [4, 2]
