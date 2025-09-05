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
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "DEFAULT_SECRET_KEY",
    { expiresIn: "3d" }
  );
};

// COOKIE OPTIONS
const getCookieOptions = () => ({
  httpOnly: true,                                 // safer: frontend JS cannot read cookie
  secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 3 * 24 * 60 * 60 * 1000,               // 3 days
});

// REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = registerSchema.validate({ name, email, password });
  if (error)
    return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(newUser._id);
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userData: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error)
    return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({ success: true, message: "User logged in" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT USER
const logout = async (req, res) => {
  res.cookie("token", "", { ...getCookieOptions(), maxAge: 0 });
  return res.status(200).json({ success: true, message: "Logout successful" });
};

module.exports = { registerUser, loginUser, logout };
