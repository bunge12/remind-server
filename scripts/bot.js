const request1 = "track yoga";
const request2 = "record running";
const request3 = "please record run";
const request4 = "pray";
const request5 = 10;

const name = (string) => {
  const n = string.split(" ");
  return n[n.length - 1];
};

const bot = (request) => {
  if (request.length) {
    console.log("text request", name(request));
    // find who the customer is
    // find the activity
    // find habit and record habit
    // congratulate customer
  } else {
    console.log("reply", request);
    // implement recordActivity
  }
};

bot(request1);
bot(request2);
bot(request3);
bot(request4);
bot(request5);
