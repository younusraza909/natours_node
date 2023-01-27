const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// Setting Env Files
dotenv.config({ path: './config.env' });

// Connecting Mongoose
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successfull');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// There might be some promise in our code which get rejected but not get handled by us
//  in node event we have a event that will trigger every time such type of scenario is created

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting Down....');
  // we can directly use .exit but it will shutdown all request currently running and its a bad way
  // so we first shut server gracefully than use process.exit
  server.close(() => {
    process.exit(1);
  });
});
