# re:mind

re:mind is a full-stack web wellness tracker app that helps people to develop and reward good habits. Users can set up reminders, track and view summary of activities, and earn rewards. _BEWARE:_ This app was published for learning purposes and it is not intended for use in production-grade software without a proper code review.

## Final Product

- This repo is the server for the app
- Shows users' dashboard and weekly progress
- Allows to add, edit, and remove habits
- Sends SMS reminders to users to complete activities
- Allows users to reply with a code to track activities
- SMS bot reads replies and recognizes activities using natual language
- API routes to read and write to the database

## Stack

### Back End (this repo)

- Express
- Node
- Cron
- Twilio
- PG
- Moment

### Front End [(link to repo)](https://github.com/bunge12/Re-Mind)

- React
- React Bootstrap
- Axios

### Design and Testing

- Storybook
- PostgreSQL hosted on ElephantSQL

## Dependencies

- Axios
- Body-parser
- Chalk
- Express
- Moment
- Node-cron
- Nodemon
- PG
- Twilio

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm start` command. The app will be served at http://localhost:8000/.
4. Go to http://localhost:8000/ in your browser.
