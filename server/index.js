// server/index.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load env variables
require("dotenv").config();

// Import routes
const userRouter = require("./routes/user-routes");
const taskRouter = require("./routes/task-routes");

// Connect to database
require("./database");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

// Test route
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello Express" });
});

// Serve frontend (production build)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 App is now running at port ${PORT}...`));
