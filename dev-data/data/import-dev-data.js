const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

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

//   Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Import Data Into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully Loaded');
  } catch (err) {
    console.log('create error', err);
  }
};

// Delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data successfully Deleted');
  } catch (err) {
    console.log('delete error', err);
  }
};

if (process.argv[2] === '--import') {
  importData();
  // process.exit();
} else if (process.argv[2] === '--delete') {
  deleteData();
  process.exit();
}
