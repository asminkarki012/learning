//done
function firstNonRepeatingLetter(s) {
  // Add your code here
  const upperCaseLetter = s.toUpperCase();
  const hasSeenObj = {};
  for (let i = 0; i < upperCaseLetter.length; i++) {
    if (!hasSeenObj[`${upperCaseLetter[i]}`]) {
      hasSeenObj[`${upperCaseLetter[i]}`] = 1;
    } else {
      hasSeenObj[`${upperCaseLetter[i]}`] += 1;
    }
  }
  let nonRepeatingLetter = findNonRepeatingLetterFromObj(hasSeenObj);
  const findKey = s.indexOf(
    nonRepeatingLetter[0].toLowerCase() || nonRepeatingLetter[0].toUpperCase()
  );
  if (findKey) {
    return s[findKey];
  } else {
    return null;
  }
}

const findNonRepeatingLetterFromObj = (obj) => {
  const objKeys = Object.keys(obj);
  for (let key of objKeys) {
    if (obj[key] === 1) {
      return key;
    }
  }
};
// console.log(firstNonRepeatingLetter("a"));
console.log(firstNonRepeatingLetter("moonmen"));
