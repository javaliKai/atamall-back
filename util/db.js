const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbUri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    console.log('Connecting DB...');
    await mongoose.connect(dbUri);
    console.log('DB connected!');
  } catch (error) {
    console.error('Error connecting to db: ', error);
    process.exit(1);
  }
};

module.exports = connectDB;
