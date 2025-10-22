const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = process.env;

exports.verifyAccessToken = async (req, res, next) => {
  // Get the Authorization header value
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(400).json({ status: false, msg: "Token not found" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ status: false, msg: "Token malformed" });
  }

  let userPayload;
  try {
    // Verify JWT token using secret
    userPayload = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    // Find user by ID decoded from token
    const user = await User.findById(userPayload.id);
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    // Attach user object to request for downstream use
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
