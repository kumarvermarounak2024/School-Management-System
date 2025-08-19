const express = require("express");
const router = express.Router();
const {
  login,
  forgetPassword,
  verifyOtp,
  sendLoginOTP,
  loginWithOTP
} = require("../../controllers/auth/authController");

router.post("/login", login);
router.post("/forgot-password", forgetPassword);
router.post("/otp-verify", verifyOtp);
router.post("/send-login-otp", sendLoginOTP);
router.post("/login-with-otp", loginWithOTP)
module.exports = router;
