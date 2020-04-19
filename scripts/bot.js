const axios = require("axios");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const twiml = new MessagingResponse();
const { recordActivity } = require("../db/queries");

const name = (string) => {
  const n = string.split(" ");
  return n[n.length - 1];
};

const bot = async (user, request) => {
  // If request has length, it's a string, handle logic
  console.log(user, request);
  // if (request.length) {
  //   // Recognize activity
  //   const activityId = await axios
  //     .get(
  //       `https://remindapp-server.herokuapp.com/api/activity/${name(request)}`
  //     )
  //     .then((data) => {
  //       return data.data[0].id;
  //     })
  //     .catch((e) => e);
  //   // Find who the user is
  //   const userId = await axios
  //     .get(`https://remindapp-server.herokuapp.com/api/phone/${user}`)
  //     .then((data) => {
  //       return data.data[0].id;
  //     })
  //     .catch((e) => e);
  //   // Check if they have a habit
  //   const habitId = await axios
  //     .get(`https://remindapp-server.herokuapp.com/api/user/${userId}/habits`)
  //     .then((data) => {
  //       let result = data.data;
  //       let habit = null;
  //       result.forEach((element) => {
  //         if (element.activity_id === activityId) {
  //           habit = element.id;
  //         }
  //       });
  //       return habit;
  //     })
  //     .catch((e) => e);
  //   if (habitId !== null) {
  //     console.log("habit recorded");
  //     recordActivity(habitId, (err, items) => {
  //       if (err) {
  //         console.log("Error");
  //         res.sendStatus(404);
  //       } else {
  //         twiml.message("Thanks! Keep up the good work!");
  //         res.writeHead(200, { "Content-Type": "text/xml" });
  //         res.end(twiml.toString());
  //       }
  //     });
  //   } else {
  //     console.log("habit not recognized");
  //   }
  // } else {
  //   console.log("habit_id received");
  //   recordActivity(habitId, (err, items) => {
  //     if (err) {
  //       console.log("Error");
  //       res.sendStatus(404);
  //     } else {
  //       twiml.message("Thanks! Keep up the good work!");
  //       res.writeHead(200, { "Content-Type": "text/xml" });
  //       res.end(twiml.toString());
  //     }
  //   });
  // }
};

module.exports = { bot };
