const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Orders DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Orders DB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
