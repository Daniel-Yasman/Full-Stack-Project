const { verify } = require("../utils/jwt");

const COOKIE_NAME = process.env.COOKIE_NAME;

module.exports = function auth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token || token === "")
    return res.status(401).json({ error: "unauthorized" });

  try {
    const { sub, role } = verify(token);
    req.user = { id: String(sub), role };
    return next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
};
