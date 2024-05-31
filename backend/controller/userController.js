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

  //   Generate Token
  const token = generateToken(user._id);

  if (passwordIsCorrect) {
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
  }

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

// Get User data

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
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
    throw Error("User not Found");
  }
});


// loginStatus
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.json(false);
  }

  // Verify Auth of Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true)
  }
  return res.json(false)

  // res.send("LoggedIn Status");
})

const UpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, phone, bio } = user;
    user.email = email
    user.name = req.body.name || name
    user.phone = req.body.phone || phone
    user.bio = req.body.bio || bio

    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });

  } else {
    res.status(400);
    throw Error("User not Found");
  }

  // res.send("Update User")
})

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  UpdateUser,
};
