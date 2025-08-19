const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("JWT ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure user object has _id property
    if (!decoded || !decoded._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized User - Invalid token" });
    }
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ error: "Unauthorized - Invalid or expired token" });
  }
};


const roleAuthorization = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ error: "Access denied: insufficient permissions" });
      }
      next();
    } catch (err) {
      console.error("Authorization error:", err.message);
      res.status(500).json({ error: "Server error in authorization" });
    }
  };
};


module.exports = { auth, roleAuthorization };
