const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB is now connected');
  } catch (err) {
    console.error('MongoDB initial connection error:', err.message);
    process.exit(1); // Crash the app if the database connection fails
  }
};

module.exports = connectDB;
