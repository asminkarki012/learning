const dirReducRecursive = (arr, cancelDir, cancelDirFlag) => {
  if (!cancelDirFlag || arr.length === 0) return arr;
  let i = 0;
  let temp = [...arr];
  cancelDirFlag = false;
  while (i < temp.length - 1) {
    if (temp[i] === cancelDir[temp[i + 1]]) {
      temp.splice(i, 2);
      cancelDirFlag = true;
    } else {
      i++;
    }
  }

  if (!cancelDirFlag || temp.length === 0) return temp;
  return dirReducRecursive(temp, cancelDir, cancelDirFlag);
};

function dirReduc(arr) {
  let cancelDirFlag = true;
  const cancelDir = {
    NORTH: "SOUTH",
    EAST: "WEST",
    SOUTH: "NORTH",
    WEST: "EAST",
  };
  return dirReducRecursive(arr, cancelDir, cancelDirFlag);
}

// console.log(
//   dirReduc(["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"])
// ); //result: ["WEST"]
const arg = {
  1: ["NORTH", "SOUTH", "EAST", "WEST", "EAST", "WEST"],
  2: [
    "EAST",
    "EAST",
    "WEST",
    "NORTH",
    "WEST",
    "EAST",
    "EAST",
    "SOUTH",
    "NORTH",
    "WEST",
  ],
};
// console.log(dirReduc(arg[1])); //result: ["WEST"]
// console.log(dirReduc(arg[2])); //result: ["WEST"]
console.log(
  "dirReduc",
  dirReduc(["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH"])
);
// console.log(
//   "dirReduc",
//   dirReduc([
//     "EAST",
//     "WEST",
//     "NORTH",
//     "SOUTH",
//     "NORTH",
//     "EAST",
//     "EAST",
//     "WEST",
//     "SOUTH",
//     "NORTH",
//   ])
// );
