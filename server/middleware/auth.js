const { verify } = require("../utils/jwt");
module.exports = function auth(req, res, next) {
  const token = req.cookies?.[process.env.COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const { sub } = verify(token);
    req.user = { id: String(sub) };
    next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
};
