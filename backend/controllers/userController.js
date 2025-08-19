const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Staff = require("../models/employeeModel")
const Admission = require("../models/admissionModel")

// ============ Register API ===============
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============== Login API ===============
exports.login = async (req, res) => {
 try {
  const { username, password } = req.body;

  let user = await Staff.findOne({ username });
  let role = 'employee';

  if (!user) {
    user = await Admission.findOne({ username });
    role = 'student';
  }

  if (!user) {
    user = await User.findOne({ username });
    role = user?.role || 'user';
  }

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // ✅ Check if user status is 'Active'
  if (user.status !== 'Active') {
    return res.status(403).json({ message: 'Account is not active. Please contact admin.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // ✅ Generate JWT token
  const token = jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      role,
    },
  });
} catch (err) {
  res.status(500).json({ message: err.message });
}
}


