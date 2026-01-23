//done
function formatDuration(seconds) {
  const timeUnits = [
    { unit: "year", duration: 24 * 60 * 60 * 365 },
    { unit: "day", duration: 24 * 60 * 60 },
    { unit: "hour", duration: 60 * 60 },
    { unit: "minute", duration: 60 },
    { unit: "second", duration: 1 },
  ];

  const resultArr = [];
  for (const { unit, duration } of timeUnits) {
    if (seconds >= duration) {
      const values = Math.floor(seconds / duration);
      seconds %= duration;
      resultArr.push(`${values} ${unit}${values !== 1 ? "s" : ""}`);
    }
  }

  return resultArr.length > 1
    ? resultArr.slice(0, -1).join(", ") + " and " + resultArr.slice(-1)
    : resultArr[0] || "now";
}
