const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id name email").lean();
  if (!user) return res.status(401).json({ error: "unauthorized" });
  res.json(user);
});

module.exports = router;
