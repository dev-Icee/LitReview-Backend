const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Reviews = require('./../Model/reviewModel');

dotenv.config({ path: './config.env' });
console.log(process.env.DB_URL);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('DB connection successful!'));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));

const importDbData = async () => {
  try {
    await Reviews.create(reviews);
    console.log('Data imported Successfully...');
  } catch (err) {
    console.log('Data could not be imported...');
    console.log(err);
  }
  process.exit();
};

const deleteDbData = async () => {
  try {
    await Reviews.deleteMany();
    console.log('Data deleted sucessfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importDbData();
} else if (process.argv[2] === '--delete') {
  deleteDbData();
}
