require("dotenv").config();
const Express = require("express");
const Cron = require("node-cron");
const App = Express();
const BodyParser = require("body-parser");
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(Express.static("public"));

const {
  getUser,
  getHabits,
  getDashboard,
  getCalendar,
  recordActivity,
  deleteHabit,
  addHabit,
  editHabit,
  getActivity,
  getByPhone,
} = require("./db/queries");

App.get("/", (req, res) => {
  res.send("Welcome to API server!");
});

// Get user by ID
App.get("/api/user/:id", (req, res) => {
  let id = req.params.id;
  getUser(id, (err, items) => {
    if (err) {
      console.log("Error");
    }
    res.send(items);
  });
});

// Get user by ID
App.get("/api/phone/:number", (req, res) => {
  let number = req.params.number;
  getByPhone(number, (err, items) => {
    if (err) {
      console.log("Error");
    }
    res.send(items);
  });
});

// Get habits for user by ID
App.get("/api/user/:id/habits", (req, res) => {
  let id = req.params.id;
  getHabits(id, (err, items) => {
    if (err) {
      console.log("Error");
    }
    res.send(items);
  });
});

// Get chart/dashboard info for user
App.get("/api/user/:id/dashboard", (req, res) => {
  let id = req.params.id;
  getDashboard(id, (err, items) => {
    if (err) {
      console.log("Error");
    }
    res.send(items);
  });
});

// Get calendar (scheduled notifications) for user
App.get("/api/user/:id/calendar", (req, res) => {
  let id = req.params.id;
  getCalendar(id, (err, items) => {
    if (err) {
      console.log("Error");
    }
    res.send(items);
  });
});

// Get activity information on name
App.get("/api/activity/:query", (req, res) => {
  let query = req.params.query;
  getActivity(query, (err, items) => {
    if (err) {
      console.log("Error");
    }
    res.send(items);
  });
});

// Record habit activity
App.post("/api/habit/:id", (req, res) => {
  let id = req.params.id;
  recordActivity(id, (err, items) => {
    if (err) {
      console.log("Error");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete habit (deactivate)
App.post("/api/habit/:id/delete", (req, res) => {
  let id = req.params.id;
  deleteHabit(id, (err, items) => {
    if (err) {
      console.log("Error");
      res.sendStatus(404);
    }
    if (items > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

// Add habit
App.post("/api/user/:id/habit/:activity/:freq", (req, res) => {
  const user_id = req.params.id;
  const activity = req.params.activity;
  const freq = req.params.freq;
  addHabit(user_id, activity, freq, (err, items) => {
    if (err) {
      console.log("Error");
      res.sendStatus(404);
    }
    if (items.rowCount > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

// Edit habit, mark all notifications done, merge new notifications
App.post("/api/habit/:id/edit/:activity/:frequency", (req, res) => {
  const habitId = req.params.id;
  const frequency = req.params.frequency;
  editHabit(habitId, frequency, (err, items) => {
    if (err) {
      console.log("Error");
      res.sendStatus(404);
    }
    if (items.length === 3) {
      res.sendStatus(200);
    }
  });
});

// Listen to incoming SMS, record activity
const { bot } = require("./scripts/bot");
App.post("/sms", (req, res) => {
  const request = req.body.Body;
  const user = req.body.From;
  bot(user, request);
});

// Every 10 minutes, check for notifications, send SMS, mark notifications complete
const { sendSms } = require("./scripts/sendSms");
Cron.schedule("*/10 * * * *", () => {
  console.log(`SMS CRON ran at ${new Date()}`);
  sendSms();
});

// Every week, generate new notifications for active habits
// TBD

App.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express seems to be listening on port ${port} so that's pretty good 👍`
  );
});
