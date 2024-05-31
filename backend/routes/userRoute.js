const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  UpdateUser,
} = require("../controller/userController");
const protect = require("../Middleware/authMiddleware");

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get("/logout", logoutUser)
router.get("/getuser", protect, getUser)
router.get("/loggedin", loginStatus)
router.patch("/updateuser", protect, UpdateUser);

module.exports = router
