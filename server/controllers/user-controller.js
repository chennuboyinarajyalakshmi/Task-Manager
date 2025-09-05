const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Schemas
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// JWT Token generator
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "DEFAULT_SECRET_KEY", {
    expiresIn: "3d", // 3 days
  });
};

// REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body; // remove await here, req.body is not a Promise

  const { error } = registerSchema.validate({ name, email, password });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User email already exists! Please try a different email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    // Set cookie for HTTPS & cross-origin
    res.cookie("token", token, {
      httpOnly: true,      // safer: frontend JS cannot read cookie
      secure: true,        // only HTTPS
      sameSite: "None",    // allow cross-origin requests
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return res.status(201).json({
      success: true,
      message: "User registration successful",
      userData: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error. Try again." });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body; // remove await here

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Incorrect email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Incorrect email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "User logged in" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error. Try again." });
  }
};

// LOGOUT USER
const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 0,
  });

  return res.status(200).json({ success: true, message: "Logout successful" });
};

module.exports = { registerUser, loginUser, logout };
