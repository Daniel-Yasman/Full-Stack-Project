module.exports = function roleCheck(requiredRole) {
  return (req, res, next) => {
    if (!req.user || !req.user.role)
      return res.status(401).json({ error: "unauthorized" });
    if (req.user.role !== requiredRole)
      return res.status(403).json({ error: "forbidden" });
    next();
  };
};
