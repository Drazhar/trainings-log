function getTodayDate() {
  const today = new Date();

  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return `${today.getFullYear()}-${month}-${day}`;
}

module.exports = { getTodayDate };
