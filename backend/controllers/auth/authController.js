const AdmissionModel = require("../../models/admissionModel");
const Employee = require("../../models/employeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const nodemailer = require("nodemailer");
// ✅ transporter ready
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sheetal.raghav0818@gmail.com",
    pass: "ejlz opdx vbyw wwfm",
  },
});
// check role by email
const findUserByEmail = async (email) => {
  const employee = await Employee.findOne({ email });
  if (employee)
    return {
      user: employee, // poora object bhejo
      model: Employee,
    };

  const student = await AdmissionModel.findOne({ email });
  if (student)
    return {
      user: student,
      model: AdmissionModel,
    };

  return null;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendLoginOTP = async (req, res) => {
  const { email } = req.body;

  console.log(email, "emailreqbody");

  try {
    const result = await findUserByEmail(email);

    if (!result) {
      return res
        .status(404)
        .json({ message: "User not found", error: "USER_NOT_FOUND" });
    }

    const { user } = result;

    if (user?.suspended || user?.isDeleted) {
      return res.status(403).json({ message: "Account not active" });
    }

    const OTP = generateOTP();

    // Optional: Save OTP and expiry (10 mins) to user DB (simple)
    user.loginOTP = OTP;
    user.loginOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins expiry
    await user.save({ validateBeforeSave: false });

    // Send OTP via mail
    const mailOptions = {
      from: "sheetal.raghav0818@gmail.com",
      to: email,
      subject: "🔐 Your Login OTP",
      html: `
        <div style="padding: 20px; font-family: Arial;">
         <h2>Hello ${
           user.name ||
           `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
           "User"
         },</h2>
         <h2>Your Role is : ${user?.role}</h2>
          <p>Your OTP for login is:</p>
          <h3>${OTP}</h3>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
      } else {
        res.status(200).json({ message: "OTP sent to your email" });
      }
    });
  } catch (error) {
    console.error("sendLoginOTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginWithOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await findUserByEmail(email);

    if (!result) {
      return res
        .status(404)
        .json({ message: "User not found", error: "USER_NOT_FOUND" });
    }
    const { user, role } = result;

    if (user?.suspended || user?.isDeleted) {
      return res.status(403).json({ message: "Account not active" });
    }

    if (user?.status === "Inactive") {
      return res.status(400).json({
        message: "You are not active user!!!",
        error: "Inactive_User",
      });
    }
    // 👉 Role Validation: role must be present
    if (!user?.role || user?.role?.trim() === "") {
      return res.status(400).json({
        message: "User role is missing.",
        error: "ROLE_REQUIRED",
      });
    }

    // 1) if not otp have user and try invalid otp
    if (!user.loginOTP || !user.loginOTPExpiry) {
      return res.status(400).json({
        message: "Please request an OTP first",
        error: "OTP_NOT_REQUESTED",
      });
    }

    // 2) if otp expired
    if (user.loginOTPExpiry < Date.now()) {
      return res
        .status(410)
        .json({ message: "OTP expired", error: "OTP_EXPIRED" });
    }

    // 3) if user have filled wrong opt
    if (user.loginOTP !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP", error: "OTP_INVALID" });
    }

    // Clear OTP after successful login
    user.loginOTP = undefined;
    user.loginOTPExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign(
      {
        id: user._id,
        fullName:
          user.fullName ||
          user.name ||
          `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.email,
        userName: user.username || "",
        mobileNo: user.mobileNo || "",
        dob: user.dob || "",
        role: role,
        profilePic: user?.photo || user?.profilePicture || "",
      },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error) {
    console.error("loginWithOTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// user login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await findUserByEmail(email);
    console.log("result", result);

    if (!result) {
      return res
        .status(404)
        .json({ message: "User not found", error: "USER_NOT_FOUND" });
    }

    const { user } = result;
    if (user?.status === "Inactive") {
      return res.status(400).json({
        message: "You are not active user!!!",
        error: "Inactive_User",
      });
    }
    // 🔒 Block login if user is suspended (safe check)
    if (user?.suspended) {
      return res.status(403).json({
        message: "Your account is suspended. Please contact support.",
        error: "ACCOUNT_SUSPENDED",
      });
    }
    // 👉 Role Validation: role must be present
    if (!user?.role || user?.role?.trim() === "") {
      return res.status(400).json({
        message: "User role is missing.",
        error: "ROLE_REQUIRED",
      });
    }

    // 🚫 Block login if user is deleted/archived (safe check)
    if (user?.isDeleted) {
      return res.status(410).json({
        message: "Account no longer exists.",
        error: "ACCOUNT_DELETED",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        error: "CREDENTIALS_DO_NOT_MATCH",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        fullName:
          user.fullName ||
          user.name ||
          `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.email,
        userName: user.username || "",
        mobileNo: user.mobileNo || "",
        dob: user.dob || "",
        profilePic: user?.photo || user?.profilePicture || "",
        role: user?.role,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        role: user?.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// forget-password
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email, "req.body");
  const result = await findUserByEmail(email);
  console.log("forgot", result);
  if (!result) {
    return res
      .status(400)
      .json({ message: "User not found", error: "USER_NOT_FOUND" });
  }

  const { user } = result;

  const OTP = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.passwordResetOTP = OTP;
  user.passwordResetOTPExpires = otpExpiry;
  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    from: "sheetal.raghav0818@gmail.com",
    to: email,
    subject: "🔐 Reset Your Password - OTP Inside",
    html: `
      <div style="padding: 20px; font-family: Arial;">
        <h2>Hi ${user?.userName || user?.username || "User"},</h2>
        <p>Your OTP for password reset is:</p>
        <h3>${OTP}</h3>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
    res
      .status(200)
      .json({ message: "OTP sent successfully", response: info.response });
  });
};

// verify
const verifyOtp = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword, otp } = req.body;

    //input validation
    if (!email) {
      return res.status(400).json({
        error: "EMAIL_REQUIRED",
        message: "Email is required.",
      });
    }

    if (!otp) {
      return res.status(400).json({
        error: "OTP_REQUIRED",
        message: "Please enter the OTP.",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        error: "PASSWORD_REQUIRED",
        message: "Please enter both new password and confirm password.",
      });
    }
    const result = await findUserByEmail(email);
    console.log("otp", result);

    if (!result) {
      return res
        .status(400)
        .json({ message: "User not found", error: "USER_NOT_FOUND" });
    }

    const { user } = result;

    if (user.passwordResetOTP !== otp) {
      return res
        .status(400)
        .json({ error: "INVALID_OTP", message: "OTP does not match" });
    }

    if (
      !user.passwordResetOTPExpires ||
      user.passwordResetOTPExpires < new Date()
    ) {
      return res
        .status(400)
        .json({ error: "OTP_EXPIRED", message: "OTP has expired" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: "PASSWORDS_DO_NOT_MATCH",
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetOTP = null;
    user.passwordResetOTPExpires = null;
    await user.save({ validateBeforeSave: false });

    const mailOptions = {
      from: "sheetal.raghav0818@gmail.com",
      to: email,
      subject: "✅ Password Successfully Reset",
      html: `
        <div style="padding: 20px; font-family: Arial;">
          <h2>Hello ${user?.username || user?.userName || "User"},</h2>
          <p>Your password has been successfully reset.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Confirmation email failed:", error);
      } else {
        console.log("Confirmation email sent:", info.response);
      }
    });

    res.json({ message: "Password updated and confirmation email sent." });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_SERVER_ERROR", message: error.message });
  }
};

module.exports = {
  login,
  sendLoginOTP,
  forgetPassword,
  verifyOtp,
  loginWithOTP,
};
