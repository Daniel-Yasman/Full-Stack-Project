const jwt = require("jsonwebtoken");

exports.sign = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
