const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Products DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Products DB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
