function scramble(str1, str2) {
  const char1Count = {}
  const char2Count = {}

  for (const char of str1) {
    char1Count[char] = (char1Count[char]||0)+1;
  }

  for (const char of str2) {

    char2Count[char] = (char2Count[char]||0)+1;
  }
  console.log(char1Count,char2Count);
  for (const char in char2Count) {
    if (!char1Count[char] || char1Count[char] < char2Count[char]) {
      return false
    }
  }
  return true;
}
console.log(scramble('katas',             'steak'      )); //false
