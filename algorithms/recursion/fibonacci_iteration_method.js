function fibs(nth) {
    const result = [0, 1];
    if (nth <= 0)
        return "Please Enter Valid nth term";
    if (nth === 1)
        return result[0];
    if (nth === 2)
        return result;
    for (var i = 2; i < nth; i++) {
        result.push(result[result.length - 2] + result[result.length - 1]);
    }
    return result;

}

console.log(fibs(8));
/* Output: [
    0, 1, 1,  2,
    3, 5, 8, 13
]*/
