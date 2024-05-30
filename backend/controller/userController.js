const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name);
  console.log(email);
  console.log(password);

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw Error("Please fill in all the required Fields");
  }

  // Password Validation
  if (password.length < 6) {
    res.status(400);
    throw Error("Password must be greater than 6 Characters");
  }

  // If user already Exits
  const userExits = await User.findOne({ email });

  if (userExits) {
    res.status(400);
    throw Error("Email already in use");
  }

  // Create new User
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-Only cookie to client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 Day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw Error("Failed to Create User");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  // res.send("Login User")
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw Error("Please add Email and Password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw Error("User's email not found");
  }

  // User exists, now check the password
  const passwordIsCorrect = await bcryptjs.compare(password, user.password);

  if (user && passwordIsCorrect) {
    const { _id, name, email, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw Error("invalid Credentials");
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  // res.send("User Logged out ");

  // Expire the cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 Day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
