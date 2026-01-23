//kata id 521c2db8ddc89b9b7a0000c1
// https://www.codewars.com/kata/521c2db8ddc89b9b7a0000c1
//done
const result = [];
let totalLength;
const snail = (arr) => {
  return [
    arr[0],
    arr.slice(1, arr.length - 1).map((row) => row[arr.length - 1]),
    arr.length > 1 ? arr[arr.length - 1].reverse() : [],
    arr
      .slice(1, arr.length - 1)
      .reverse()
      .map((row) => row[0]),
    arr.length <= 4
      ? arr
          .slice(1, arr.length - 1)
          .map((row, i) =>
            i % 2 === 0
              ? row.slice(1, arr.length - 1)
              : row.slice(1, arr.length - 1).reverse()
          )
          .flat()
      : snail(
          arr
            .slice(1, arr.length - 1)
            .map((row) => row.slice(1, arr.length - 1))
        ),
  ].flat();
};

// const array = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];
const array = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];
// console.log(snail(array));
//  #=> [1,2,3,6,9,8,7,4,5]
// console.log(
//   snail([
//     [21, 22, 23, 24],
//     [32, 33, 34, 25],
//     [31, 36, 35, 26],
//     [30, 29, 28, 27],
//   ])
// );
// (0,1) 0,2 0,3 1,3 1,4
console.log(
  snail([
    [1, 2, 3, 4, 5, 6],
    [20, 21, 22, 23, 24, 7],
    [19, 32, 33, 34, 25, 8],
    [18, 31, 36, 35, 26, 9],
    [17, 30, 29, 28, 27, 10],
    [16, 15, 14, 13, 12, 11],
  ])
);

// [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
//   22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
// ]
