const mongoose = require('mongoose');

// Connect to MongoDB using the configured connection string with retry
const connectDB = async (retries = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (retries > 0) {
      console.log(`Retrying MongoDB connection in 2 seconds... (${retries} retries remaining)`);
      setTimeout(() => connectDB(retries - 1), 2000);
    }
  }
};

module.exports = connectDB;
