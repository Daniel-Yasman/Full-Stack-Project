const User = require("../models/User");

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: "All fields must be filled" });
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
  try {
    const user = await User.findOne({ email });

    if (!user || user.password != password)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.status(200).json({
      message: "Login successfull",
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
