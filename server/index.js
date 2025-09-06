const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

// Routes
const userRouter = require("./routes/user-routes");
const taskRouter = require("./routes/task-routes");

// DB
require("./database");

const app = express();

// ✅ CORS: allow local dev + production
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

const __dirname = path.resolve();

// ✅ Serve frontend (production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 App running on port ${PORT}...`));
