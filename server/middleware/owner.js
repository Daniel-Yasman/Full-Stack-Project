module.exports = function owner(req, res, next) {
  if (req.params.userId !== req.user.id) {
    return res.status(403).json({ error: "forbidden" });
  }
  next();
};
