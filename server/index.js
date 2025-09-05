const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Routes
const userRouter = require("./routes/user-routes");
const taskRouter = require("./routes/task-routes");

// Database connection
require("./database");

const app = express();

// Allowed origins from ENV (comma separated)
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // important for cookies
  })
);

// Cookie parser
app.use(cookieParser());

// JSON body parser
app.use(express.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

// Test route
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Backend is working" });
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}...`));
