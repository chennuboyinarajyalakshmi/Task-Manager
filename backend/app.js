const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// CORS configuration — include your Vercel frontend URL
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://task-manager-hw8r0u393-rajyalakshmi-chennuboyinas-projects.vercel.app"
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// Simple root endpoint
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Start server
const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
