//Setup libraries we want to use (installed them first with *npm install*)
const webpush = require("web-push");
const fetch = require("node-fetch");
const prompts = require("prompts");

//Location of your subscribers file (normally they would be in a database)
const yourSubscriberJSONFileURL =
  "https://i461328.hera.fhict.nl/data/subscribers.json";

//Place your keys here
webpush.setVapidDetails(
  "mailto: <461328@student.fontys.nl>>", //Subject VAPID
  "BDKdrF0mkND8w4HwYf9S83hkQvPQrz-kYeAUTTCwihkt9s7ib8qY5XOb53v_p3GIgIvK_c5cLN0fs9KGS88cGgI", // Public Key VAPID
  "cZh_BEYKQ-qW1ZsyHYriTK5lX7cyxLvDzg9p1ZjaMTk" //Private Key VAPID
);

console.log(
"AHHHHHHHHHHHHHHHHHHH"
);

//This allows you to fill in the titel and message of the notification in the CLI
const questions = [
  {
    type: "text",
    name: "title",
    message: "Push notification title"
  },
  {
    type: "text",
    name: "message",
    message: "Push notification message"
  }
];

(async () => {
  const answers = await prompts(questions);

  console.log(
   "this is a message to my subscribers"
  );

  //Putting the promted title and message in variables to use
  let pushTitle = answers.title;
  let pushMessage = answers.message;

  //Send a notification to every subscriber
  fetch(yourSubscriberJSONFileURL)
    .then(subscriberJSON => subscriberJSON.json())
    .then(subscriberJSON => {
      for (let subscriberEndpoint in subscriberJSON) {
        //Setting up format of subcription for sending
        const pushSubscription = {
          endpoint: subscriberEndpoint,
          keys: {
            auth: subscriberJSON[subscriberEndpoint]["keys"]["auth"],
            p256dh: subscriberJSON[subscriberEndpoint]["keys"]["p256dh"]
          }
        };
        //Actual sending
        webpush
          .sendNotification(
            pushSubscription,
            `{"title":"${pushTitle}","message":"${pushMessage}"}`
          )
          .then(result => {
            console.log(`-- Message send to ${pushSubscription.endpoint}`);
          })
          .catch(error => {
            console.log(`-- Message NOT send to ${pushSubscription.endpoint}`);
          });
      }
    });
})();
