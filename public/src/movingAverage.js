function getMovingAverage(inputArray, days) {
  const msPerDay = 86400000;
  let movingAverage = [];
  days = Math.floor(days / 2);

  for (let i = 0; i < inputArray.length; i++) {
    let count = 1;
    let sum = inputArray[i].weight;
    for (let j = i - 1; j >= 0; j--) {
      const daysDifference =
        (inputArray[i].date - inputArray[j].date) / msPerDay;
      if (daysDifference <= days) {
        count++;
        sum += inputArray[j].weight;
      } else {
        break;
      }
    }

    for (let j = i + 1; j < inputArray.length; j++) {
      const daysDifference =
        (inputArray[j].date - inputArray[i].date) / msPerDay;
      if (daysDifference <= days) {
        count++;
        sum += inputArray[j].weight;
      } else {
        break;
      }
    }
    movingAverage.push({ date: inputArray[i].date, weight: sum / count });
  }

  return movingAverage;
}

module.exports = { getMovingAverage };
