const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuthVerification = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ success: false, message: "Token not found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "DEFAULT_SECRET_KEY");
    const userInfo = await User.findById(decoded.userId).select("-password");

    if (!userInfo)
      return res.status(404).json({ success: false, message: "User not found" });

    req.user = userInfo; // attach user info to request
    next(); // continue to next middleware/route
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }
};

module.exports = { userAuthVerification };
