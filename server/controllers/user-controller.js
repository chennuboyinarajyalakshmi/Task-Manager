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

// JWT token generator
const generateToken = (userId) => {
  return jwt.sign({ userId }, "DEFAULT_SECRET_KEY", { expiresIn: "3d" });
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = registerSchema.validate({ name, email, password });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(newUser._id);

    res.cookie("token", token, { httpOnly: true, withCredentials: true });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userData: { name: newUser.name, email: newUser.email, _id: newUser._id },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Incorrect email" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true, withCredentials: true });

    return res.status(200).json({ success: true, message: "User logged in" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, withCredentials: true });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logout };
