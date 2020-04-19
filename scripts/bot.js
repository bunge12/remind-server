const axios = require("axios");

const name = (string) => {
  const n = string.split(" ");
  return n[n.length - 1];
};

const bot = async (user, request) => {
  // If request has length, it's a string, handle logic
  if (!parseInt(request)) {
    // Recognize activity
    const activityId = await axios
      .get(
        `https://remindapp-server.herokuapp.com/api/activity/${name(request)}`
      )
      .then((data) => {
        return data.data[0].id;
      })
      .catch((e) => e);
    // Find who the user is
    const userId = await axios
      .get(`https://remindapp-server.herokuapp.com/api/phone/${user}`)
      .then((data) => {
        return data.data[0].id;
      })
      .catch((e) => e);
    // Check if they have a habit
    const habitId = await axios
      .get(`https://remindapp-server.herokuapp.com/api/user/${userId}/habits`)
      .then((data) => {
        let result = data.data;
        let habit = null;
        result.forEach((element) => {
          if (element.activity_id === activityId) {
            habit = element.id;
          }
        });
        return habit;
      })
      .catch((e) => e);
    if (habitId !== null) {
      console.log("habit recorded");
      return habitId;
    } else {
      console.log("habit not recognized");
      return null;
    }
  } else {
    const id = parseInt(request);
    console.log(`habit_id received: ${id}`);
    return id;
  }
};

// bot("+16475233081", "kkkk").then((r) => console.log(r));
module.exports = { bot };
