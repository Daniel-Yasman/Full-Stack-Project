const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { sign } = require("../utils/jwt");
const cookieOptions = require("../utils/cookies");
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneIL = /^05\d{8}$/;

function isValidEmail(s) {
  return typeof s === "string" && emailRe.test(s);
}

function isValidPassword(s) {
  if (typeof s !== "string" || s.length < 8) return false;
  return /[a-zA-Z]/.test(s) && /[0-9]/.test(s);
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
  let { email, password } = req.body || {};
  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  const passOk = typeof password === "string" && password.length > 0;

  if (!email || !passOk)
    return res
      .status(400)
      .json({ error: "missing_fields", details: ["email", "password"] });

  if (!isValidEmail(email))
    return res.status(400).json({ error: "invalid_input" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const token = sign(user._id);
    res
      .cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .status(200)
      .json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "login_failed" });
  }
};

const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
  return res.status(204).end();
};

module.exports = {
  register,
  login,
  logout,
};
