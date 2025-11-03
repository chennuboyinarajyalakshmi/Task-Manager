const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// ✅ Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local development
      "https://task-manager-hw8r0u393-rajyalakshmi-chennuboyinas-projects.vercel.app" // your deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// ✅ Production handling (optional)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
