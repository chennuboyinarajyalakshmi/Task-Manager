const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = registerSchema.validate({ name, email, password });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const isUserEmailAlreadyExists = await User.findOne({ email });

    if (isUserEmailAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User email already exists! Please try with a different email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newlyCreatedUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = generateToken(newlyCreatedUser._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true, // safer
    });

    return res.status(201).json({
      success: true,
      message: "User registration successful",
      userData: {
        name: newlyCreatedUser.name,
        email: newlyCreatedUser.email,
        _id: newlyCreatedUser._id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const getUser = await User.findOne({ email });

    if (!getUser) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    const checkAuth = await bcrypt.compare(password, getUser.password);

    if (!checkAuth) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const token = generateToken(getUser._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};
