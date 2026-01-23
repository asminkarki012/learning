//incomplete need to solve
function getWays(n: number, c: number[]): number {
  // let counter = 0;

  // if (c.indexOf(n) != -1) counter++;
  //
  // if (c.indexOf(1) != -1) counter++

  const filterGreaterNum = c.filter(x => (!(x > n)))

  const { counter } = addEveryAndFilter(filterGreaterNum, 0, n)
  return counter


}

function addEveryAndFilter(array: number[], counter: number, targetSum: number): { array: number[], counter: number, targetSum: number } {
  console.log("targetsum",targetSum);
  if (array.length < 1) return { array, counter, targetSum };
  const result: number[] = [];

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      const added = array[i] + array[j];
      console.log("added",added);
      if (added === targetSum) {
        counter++
      } else if (added < targetSum) {
        result.push(added);
      }
    }
  }
  console.log("len of result",result.length)
  return addEveryAndFilter(result, counter, targetSum);
}

console.log(getWays(3, [8, 3, 1, 2])); //op 4

// console.log(getWays(10, [2, 5, 3, 6]));
