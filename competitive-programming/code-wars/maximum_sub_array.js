//done
// Maximum subarray sum
function maxSequence(arr) {
  let maxEndingHere = arr[0];
  let maxSoFar = arr[0];

  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

// Example usage:
const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
// const result = maxSubarraySum(array);

// console.log("Maximum sum subarray:", result);

console.log(maxSequence([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log(
  maxSequence([
    7, 4, 11, -11, 39, 36, 10, -6, 37, -10, -32, 44, -26, -34, 43, 43,
  ])
);
// should be 6: [4, -1, 2, 1]
