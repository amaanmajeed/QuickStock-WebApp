const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  UpdateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controller/userController");
const protect = require("../Middleware/authMiddleware");

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get("/logout", logoutUser)
router.get("/getuser", protect, getUser)
router.get("/loggedin", loginStatus)
router.patch("/updateuser", protect, UpdateUser);
router.patch("/changepassword", protect, changePassword)
router.post("/forgotpassowrd", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router
