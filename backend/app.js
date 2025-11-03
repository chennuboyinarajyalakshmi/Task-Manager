const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// ✅ Updated CORS settings
app.use(cors({
  origin: [
    "http://localhost:3000", // for local testing
    "https://task-manager-fw0xhcis0-rajyalakshmi-chennuboyinas-projects.vercel.app" // your Vercel frontend URL
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected..."))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// Serve frontend in production (optional for local build)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  );
}

// Start server
const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`🚀 Backend running on port ${port}`));
