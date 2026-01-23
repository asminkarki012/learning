const fibsRec = (nth, result = [0, 1]) => {
  if (result.length >= nth) {
    return result;
  } else {
    return fibsRec(nth, [
      ...result,
      result[result.length - 1] + result[result.length - 2],
    ]);
  }
};

console.log(fibsRec(8)); 
/* Output: [
    0, 1, 1,  2,
    3, 5, 8, 13
]*/
