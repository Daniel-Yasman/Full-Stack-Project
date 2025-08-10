const { verify } = require("../utils/jwt");

const COOKIE_NAME = process.env.COOKIE_NAME;

module.exports = function auth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token || token === "")
    return res.status(401).json({ error: "unauthorized" });

  try {
    const { sub } = verify(token);
    req.user = { id: String(sub) };
    return next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
};
