const User = require("../models/User");
const bcrypt = require("bcrypt");
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneIL = /^05\d{8}$/;

function isValidEmail(s) {
  return typeof s === "string" && emailRe.text(s);
}

function isValidPassword(s) {
  if (typeof s !== "string" || s.length < 8) return false;
  return /[a-zA-z]/.text(s) && /[0-9]/.text(s);
}

function isValidIsraeliPhone(s) {
  return typeof s === "string" && phoneIL.test(s);
}

const register = async (req, res) => {
  let { name, email, password, phone } = req.body || {};
  name = typeof name === "string" ? name.trim() : "";
  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  phone = typeof phone === "string" ? phone.trim() : "";

  if (!name || !email || !password || !phone)
    return res.status(400).json({
      error: "missing_fields",
      details: ["name", "email", "password", "phone"],
    });

  if (
    !isValidEmail(email) ||
    !isValidPassword(password) ||
    !isValidIsraeliPhone(phone)
  )
    return res.status(400).json({ error: "invalid_input" });

  const exists = await User.findOne({ email }).lean();
  if (exists) return res.status(409).json({ error: "email_exists" });

  try {
    const cost = Number(process.env.BCRYPT_COST || 10);
    const passwordHash = await bcrypt.hash(password, cost);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      phone,
      cart: [],
    });
    return res
      .status(201)
      .json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "register_failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields must be filled" });
  if (!isValidEmail(email) || !isValidPassword(password))
    return res.status(400).json({ message: "Invalid credentials" });
  try {
    const user = await User.findOne({ email });

    if (!user || user.password != password)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to log-in user" });
  }
};

module.exports = {
  register,
  login,
};
