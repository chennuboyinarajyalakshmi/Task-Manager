const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// ✅ CORS Configuration — include ALL your frontend URLs
app.use(cors({
  origin: [
    "http://localhost:3000", // for local testing
    "https://task-manager-five-xi.vercel.app", // main Vercel domain
    "https://task-manager-2jecadg5e-rajyalakshmi-chennuboyinas-projects.vercel.app",
    "https://task-manager-hw8r0u393-rajyalakshmi-chennuboyinas-projects.vercel.app",
    "https://task-manager-git-main-rajyalakshmi-chennuboyinas-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// ✅ Root Route (for Render check)
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// ✅ Start Server
const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
