const User = require("../models/User");

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
function isValidPassword(password) {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}
function isValidIsraeliPhone(phone) {
  const pattern = /^05\d{8}$/;
  return pattern.test(phone);
}

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: "All fields must be filled" });
  if (!name.trim())
    return res.status(400).json({ message: "Name is required" });
  if (
    !isValidEmail(email) ||
    !isValidPassword(password) ||
    !isValidIsraeliPhone(phone)
  )
    return res.status(400).json({ message: "Invalid credentials" });
  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email already exists" });
  try {
    const newUser = new User({
      name,
      email,
      password,
      phone,
    });
    await newUser.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to register user" });
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
