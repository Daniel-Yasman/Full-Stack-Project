const router = require("express").router();
const { verify } = require("../utils/jwt");
const User = require("../models/User");

router.get("/me", async (req, res) => {
  const token = req.cookies?.[process.env.COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const { sub } = verify(token);
    const user = await User.findById(sub).select("_id name email").lean();
    if (!user) return res.status(401).json({ error: "unauthorized" });
    res.json(user);
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
});

module.exports = router;
