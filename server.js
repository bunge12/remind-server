require("dotenv").config();
const Express = require("express");
const Cron = require("node-cron");
const App = Express();
const BodyParser = require("body-parser");
const PORT = 8080;
const MessagingResponse = require("twilio").twiml.MessagingResponse;

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
} = require("./db/queries");


App.get("/api/test/:id", (req, res) => {
  res.send(req.params.id);
});
const { sendSms } = require("./send_reminder");

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
App.post("/api/user/:id/habit/:habit/:freq", (req, res) => {
  const user_id = req.params.id;
  const habit = req.params.habit;
  const freq = req.params.freq;
  addHabit(user_id, habit, freq, (err, items) => {
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

// Listen to incoming SMS, record activity
App.post("/sms", (req, res) => {
  const id = parseInt(req.body.Body);
  const twiml = new MessagingResponse();

  recordActivity(id, (err, items) => {
    if (err) {
      console.log("Error");
      res.sendStatus(404);
    } else {
      twiml.message("Thanks! Keep up the good work!");
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    }
  });
});

// Every 10 minutes, check for notigications, send SMS
Cron.schedule("*/10 * * * *", () => {
  console.log("running every 10 minutes!");
  // sendSms();
});

// Every week, generate new notifications for active habits
// TBD

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express seems to be listening on port ${PORT} so that's pretty good 👍`
  );
});

// comment
