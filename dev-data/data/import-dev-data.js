const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

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
  .then((con) => {
    console.log(con.connections);
    console.log('DB connection successfull');
  });

//   Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import Data Into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully Loaded');
  } catch (err) {
    console.log('create error', err);
  }
};

// Delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully Deleted');
  } catch (err) {
    console.log('delete error', err);
  }
};

if (process.argv[2] === '--import') {
  importData();
  process.exit();
} else if (process.argv[2] === '--delete') {
  deleteData();
  process.exit();
}