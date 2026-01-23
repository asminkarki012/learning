//https://www.codewars.com/kata/550498447451fbbd7600041c

function comp(array1, array2) {

  if (!Array.isArray(array1) || !Array.isArray(array2)) return false

  const occurenceArray1 = countOccurence(array1);
  const occurenceArray2 = countOccurence(array2)
  for (const num of array1) {
    const squaredNum = num ** 2;
    const isSame = array2.includes(squaredNum) && occurenceArray1[num] === occurenceArray2[squaredNum]
    if (!isSame) return false
  }
  return true;

}

const countOccurence = (arr) => {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc;
  }, {})
}

let a1 = [121, 144, 19, 161, 19, 144, 19, 11];
let a2 = [11 * 11, 121 * 121, 144 * 144, 19 * 19, 161 * 161, 19 * 19, 144 * 144, 19 * 19];

const b1 = [121, 144, 19, 161, 19, 144, 19, 11]
const b2 = [121, 14641, 20736, 36100, 25921, 361, 20736, 361]
// console.log(comp(a1, a2));
//
// const a = [121, 144, 19, 161, 19, 144, 19, 11]  
// const b = [132, 14641, 20736, 361, 25921, 361, 20736, 361]
const c1 = [2, 2, 3]
const c2 = [4, 9, 9]
console.log(comp(c1, c2));
