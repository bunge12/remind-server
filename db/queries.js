const { Pool } = require("pg");
const dbParams = require("./db.js");
const db = new Pool(dbParams);
db.connect();

// Get User Information
const getUser = (id, cb) => {
  db.query(`SELECT * from users where id=${id} LIMIT 1;`)
    .then((data) => {
      console.log("Test user data", data.rows);
      cb(null, data.rows);
    })
    .catch((err) => console.log(err));
};

// Get Habits Information
const getHabits = (id, cb) => {
  db.query(
    `select habits.*, name, image from habits 
    right join activities on activity_id = activities.id 
    where user_id = ${id} and habits.active = true`
  )
    .then((data) => {
      console.log("Test user data", data.rows);
      cb(null, data.rows);
    })
    .catch((err) => console.log(err));
};

const summary = (data) => {
  let result = [];
  let rate = 0;
  data.forEach((element) => {
    let completion = element.current / element.frequency;
    completion > 1 ? (completion = 1) : (completion = completion);
    rate += completion;
    element.current = completion * 100;
    delete element.frequency;
    element.max = 100;
    result.push(element);
  });
  let overall = {
    name: "Overall",
    max: 100,
    current: (rate / data.length) * 100,
  };
  result.push(overall);
  return result;
};
const getDashboard = (id, cb) => {
  db.query(
    `select habits.id as habit_id, count(habit_id) as current, frequency, name from habits 
    left join (select * from habits_journal where habits_journal.created_at > date_trunc('week', current_date)) as foo on habit_id = habits.id
    join activities on  activity_id = activities.id
    where  user_id = ${id} 
    group by habits.id, frequency, activities.name;
    `
  )
    .then((data) => {
      const processed = summary(data.rows);
      cb(null, processed);
    })
    .catch((err) => console.log(err));
};

const calendar = (data) => {
  let curr = new Date();
  let week = [];
  for (let i = 1; i <= 7; i++) {
    let first = curr.getDate() - curr.getDay() + i;
    let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    week.push({ day: day, plan: [] });
  }
  week.forEach((element) => {
    data.forEach((record) => {
      let r = record.day.toISOString().slice(0, 10);
      if (element.day === r) {
        element.plan.push(record.name);
      }
    });
  });
  return week;
};
const getCalendar = (id, cb) => {
  db.query(
    `select habit_id, date_trunc('day', scheduled_time) as day, name, image
    from notifications
    join habits on habit_id = habits.id
    join activities on activity_id = activities.id
    where scheduled_time >= date_trunc('week', current_date) and scheduled_time < date_trunc('week', current_date) + interval '7 days'  and user_id = ${id} and habits.active = true
    group by scheduled_time, habit_id, name, image
    order by scheduled_time;`
  )
    .then((data) => {
      const processed = calendar(data.rows);
      cb(null, processed);
    })
    .catch((err) => console.log(err));
};

// Record Activity Information
const recordActivity = (id, cb) => {
  db.query(`insert into habits_journal (habit_id) values (${id});`)
    .then((res) => {
      console.log("reponse:", res);
      cb(null, res);
    })
    .catch((err) => {
      cb(err, null);
      console.log(err);
    });
};

// Record Activity Information
const deleteHabit = (id, cb) => {
  db.query(`update habits set active=false where id=${id}`)
    .then((res) => {
      console.log("reponse:", res.rowCount);
      cb(null, res.rowCount);
    })
    .catch((err) => {
      cb(err, null);
      console.log("query error", err);
    });
};

// Add habit, set reminders
const { setReminders } = require("../set_reminders");
async function addHabit(user_id, habit, freq, cb) {
  const query = `INSERT INTO habits (user_id, activity_id, frequency)
  VALUES (${user_id}, ${habit}, ${freq}) RETURNING id;`;
  const res = await db.query(query);
  const newId = res.rows[0].id;
  const sql = setReminders(newId, freq, true);
  db.query(`${sql}`)
    .then((res) => {
      console.log("reponse:", res);
      cb(null, res);
    })
    .catch((err) => {
      cb(err, null);
      console.log("error ", err);
    });
}

module.exports = {
  getUser,
  getHabits,
  getDashboard,
  getCalendar,
  recordActivity,
  deleteHabit,
  addHabit,
};
