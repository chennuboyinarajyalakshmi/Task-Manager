const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Use uppercase

const userAuthVerification = async (req, res) => {
  const token = req.cookies.token;
  console.log(token, "token");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is not available or invalid",
    });
  }

  try {
    // Make sure the key matches your token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "DEFAULT_SECRET_KEY");
    console.log(decoded, "decoded");

    const userInfo = await User.findById(decoded.userId).select("-password"); // exclude password
    console.log(userInfo, "userInfo");

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      userInfo,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
};

module.exports = { userAuthVerification };
