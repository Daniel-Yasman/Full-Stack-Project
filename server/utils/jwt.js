const jwt = require("jsonwebtoken");

exports.sign = (userId, role) => {
  console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);

  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
