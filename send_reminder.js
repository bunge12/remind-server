// DB Connection Setup
require("dotenv").config();
const { Pool } = require("pg");
const dbParams = require("./db/db.js");
const db = new Pool(dbParams);
db.connect();

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Script to query the database and see if there are pending notfications
const getPending = (cb) => {
  db.query(
    `select n.*, h.user_id, u.first_name, u.phone, a.name from notifications n
    join habits h on habit_id = h.id
    join users u on user_id = u.id
    join activities a on activity_id = a.id
    where scheduled_time >= current_timestamp - interval '720 minutes' and scheduled_time < current_timestamp + interval '720 minutes'`
  )
    .then((data) => {
      cb(data.rows);
    })
    .catch((err) => console.log(err));
};

// Send SMS to those notifications
const sendSms = () => {
  getPending((result) => {
    result.forEach((element) => {
      console.log(element);
      client.messages
        .create({
          body: `Hey ${element.first_name}. Reminder to do ${element.name} from re:mind! Have you completed it? Reply with ${element.habit_id} to record activity`,
          from: "+19893751056",
          to: `${element.phone}`,
        })
        .then((message) => console.log(message.sid));
    });
  });
  db.end();
};

// Mark them complete
// TBD
module.exports = { sendSms };
