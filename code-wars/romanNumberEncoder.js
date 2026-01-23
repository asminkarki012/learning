//PROBLEM NAME:Roman Numerals Encoder

// 1000=M, 900=CM, 90=XC; resulting in MCMXC. 2008 is written as 2000=MM, 8=VIII; or MMVIII. 1666 uses each Roman symbol in descending order: MDCLXVI
// solution(1000); // should return 'M'
const romanNumberEncoder = (num) => {
  const romanNumerals = {
    1000: "M",
    900: "CM",
    500: "D",
    400: "CD",
    100: "C",
    90: "XC",
    50: "L",
    40: "XL",
    10: "X",
    9: "IX",
    5: "V",
    4: "IV",
    1: "I",
  };

  let result = "";
  const romanEncoderConstant = Object.keys(romanNumerals)
    .map((r) => ({ value: Number(r), numerals: romanNumerals[r] }))
    .sort((a, b) => b.value - a.value);

  for (let { value, numerals } of romanEncoderConstant) {
    while (num >= value) {
      result += numerals;
      num -= value;
    }
  }
  console.log("result: " + result);
  return result;
};

romanNumberEncoder(3);
