const moment = require("moment");

// Generate this week
const thisWeek = () => {
  let curr = new Date();
  let week = [];
  for (let i = 1; i <= 7; i++) {
    let first = curr.getDate() - curr.getDay() + i;
    let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    week.push(day);
  }
  return week;
};

//Pick 'n' random days
const generateRandomDays = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

// Generate SQL based on week, 'n', and habit_id
// Next week reminders TBD - if 'current' is false
const setReminders = (id, freq, current) => {
  const reminders = generateRandomDays(thisWeek(), freq);
  let sql =
    "INSERT INTO notifications (habit_id, notification_type, scheduled_time) VALUES ";
  reminders.forEach((element) => {
    let timestamp = moment(element).hour(13);
    sql += `(${id}, 'sms', '${moment(timestamp).format()}'),`;
  });
  const fixed = sql.slice(0, -1).concat(";");
  return fixed;
};

module.exports = { setReminders };
