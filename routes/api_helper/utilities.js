function getTodayDate(diffMonth) {
  const today = new Date();

  if (diffMonth) {
    today.setMonth(today.getMonth() - diffMonth);
  }

  return getSqlDate(today);
}

function getSqlDate(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return `${date.getFullYear()}-${month}-${day}`;
}

module.exports = { getTodayDate, getSqlDate };
