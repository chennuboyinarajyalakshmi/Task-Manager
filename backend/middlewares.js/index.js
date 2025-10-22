// backend/middlewares.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyAccessToken = async (req, res, next) => {
  try {
    // Step 1: Get token from headers
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    // Step 2: Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Malformed token" });
    }

    // Step 3: Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Token verification failed" });
    }

    // Step 4: Find user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Step 5: Attach user info to req.user
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("verifyAccessToken error:", err);
    return res.status(500).json({ success: false, message: "Internal server error verifying token" });
  }
};
