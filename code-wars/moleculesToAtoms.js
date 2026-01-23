//Molecule to atoms
//done
function parseMolecule(formula) {
  const BRACKETS = ["(", ")", "[", "]", "{", "}"];
  // const BRACKETS_OBJECT = { "(": ")", "[": "]", "{": "}" };
  const splitFormula = formula.split("");
  const properMappedFormula = splitFormula
    .map((char, index) => {
      const atomObj = {};
      if (/^[A-Z]$/.test(char)) {
        if (
          /^[a-z]$/.test(splitFormula[index + 1]) &&
          index < splitFormula.length - 1
        ) {
          atomObj[char + splitFormula[index + 1]] = 1;
          return atomObj;
        } else {
          atomObj[char] = 1;
          return atomObj;
        }
      } else if (BRACKETS.includes(char)) {
        return char;
        //for
      } else if (
        /^[0-9]$/.test(char) &&
        !/^[0-9]$/.test(splitFormula[index + 1])
      ) {
        return Number(char);
      } else if (
        /^[0-9]$/.test(char) &&
        /^[0-9]$/.test(splitFormula[index + 1])
      ) {
        return Number(char + splitFormula[index + 1]);
      }
    })
    .filter((x) => x);
  const findClosingBracketIndex = (bracket, data, openingBracketIndex) => {
    if (bracket === BRACKETS[0]) {
      const stack = [];
      for (let i = openingBracketIndex; i < data.length; i++) {
        if (data[i] === BRACKETS[0]) {
          stack.push(i);
        } else if (data[i] === BRACKETS[1]) {
          if (stack.length === 0) {
            return -1;
          } else {
            stack.pop();
            if (stack.length === 0) {
              return i;
            }
          }
        }
      }
    }
    if (bracket === BRACKETS[2]) return data.indexOf(BRACKETS[3]);
    if (bracket === BRACKETS[4]) return data.indexOf(BRACKETS[5]);
  };
  let closingBracketIndex;
  let prodValue = 1;
  let closingBracketAfterNum = 1;
  const finalObject = {};
  const keepTrackOfClosingBracketIndexAndNumber = {};
  const result = properMappedFormula
    .map((symbolObj, index) => {
      const atomObj = {};
      if (["(", "{", "["].includes(symbolObj)) {
        closingBracketIndex = findClosingBracketIndex(
          symbolObj,
          properMappedFormula,
          index
        );
        if (typeof properMappedFormula[closingBracketIndex + 1] === "number") {
          closingBracketAfterNum = properMappedFormula[closingBracketIndex + 1];
          keepTrackOfClosingBracketIndexAndNumber[closingBracketIndex] =
            closingBracketAfterNum;
          prodValue *= closingBracketAfterNum;
        }
      }

      if (
        keepTrackOfClosingBracketIndexAndNumber[index] &&
        typeof keepTrackOfClosingBracketIndexAndNumber[index] === "number"
      ) {
        prodValue = prodValue / keepTrackOfClosingBracketIndexAndNumber[index];
      }
      if (typeof symbolObj === "object") {
        const immediateNumberAfterSymbol = properMappedFormula[index + 1];
        if (typeof immediateNumberAfterSymbol === "number") {
          const key = Object.keys(symbolObj)[0];
          const values = Object.values(symbolObj)[0];
          atomObj[key] = values * immediateNumberAfterSymbol * prodValue;
          return atomObj;
        } else if (immediateNumberAfterSymbol !== "number") {
          const key = Object.keys(symbolObj)[0];
          const values = Object.values(symbolObj)[0];
          atomObj[key] = values * prodValue;
          return atomObj;
        }
      }
    })
    .filter((x) => x)
    .forEach((symbolObj) => {
      const key = Object.keys(symbolObj)[0];
      const values = Object.values(symbolObj)[0];
      if (finalObject[key]) {
        finalObject[key] += values;
      } else {
        finalObject[key] = values;
      }
    });
  return finalObject;
}

// console.log(parseMolecule("H2O")); // return {H: 2, O: 1}
// console.log(parseMolecule("Mg(OH)2"));
// return { Mg: 1, O: 2, H: 2 };
console.log(parseMolecule("K4[ON(SO3)2]2"));
// console.log(parseMolecule("C6H12O6"));
// console.log(parseMolecule("(C5H5)Fe(CO)2CH3"));
// console.log(parseMolecule("(CO)2"));
// console.log(parseMolecule("CH3"));
// console.log(parseMolecule("As2{Be4C5[BC3(CO2)3]2}4Cu5"));
//{ As: 2, Be: 16, C: 44, B: 8, Co: 24, O: 48, Cu: 40 }
//result should be {'O': 48, 'Co': 24, 'Be': 16, 'Cu': 5, 'C': 44, 'B': 8, 'As': 2}
