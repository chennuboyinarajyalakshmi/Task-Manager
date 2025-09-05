// server/database.js
const mongoose = require("mongoose");
require("dotenv").config(); // load env vars here as well (safe practice)

// Debug: check if MONGO_URI is being read correctly

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Error occurred while connecting to MongoDB:", err.message);
    process.exit(1); // Exit app if DB fails
  }
};

// Immediately invoke connection when this file is required
connectDB();

module.exports = mongoose;
