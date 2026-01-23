//done
function generateHashtag(str) {
  let hashedString = "";
  //condition for false;
  const tooManyChar = str
    .trim()
    .split(" ")
    .filter((x) => x !== "")
    .map((x) => x.trim().length);
  const isTooLong = Math.max(...tooManyChar) > 140;
  const emptySpace = str.trim() === "";
  const allFalseCondition = isTooLong || emptySpace ? true : false;

  if (allFalseCondition) {
    return false;
  }
  const splitStr = str
    .trim()
    .toLowerCase()
    .split(" ")
    .filter((x) => x !== "");

  if (splitStr === 1) {
    return "#" + str.charAt(0).toUpperCase() + str.slice(1);
  }
  splitStr.forEach(
    (x) => (hashedString += x.charAt(0).toUpperCase() + x.slice(1))
  );
  return "#" + hashedString;
}
// console.log(generateHashtag("    Hello     World   "));
// generateHashtag(
//   "Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Cat"
// );
// console.log(generateHashtag("Do We have A Hashtag"));
console.log(generateHashtag("code" + " ".repeat(140) + "wars"));
