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

// Allowed origins from ENV
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// JSON parser
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

// Test
app.get("/api", (req, res) => res.json({ message: "Backend is working" }));

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}...`));
