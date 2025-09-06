const express = require("express");
const userRouter = express.Router();

const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/user-controller");
const { userAuthVerification } = require("../middleware/auth-middlware");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/auth", userAuthVerification, (req, res) => {
  res.json({
    success: true,
    message: "User authenticated",
    user: req.user,
  });
});


userRouter.post("/logout", logout);


module.exports = userRouter;
