const authMiddleware = (req, res, next) => {
  const authToken = req.headers["authorization"]
    ? req.headers["authorization"].split("Bearer ")[1]
    : "";
  if (!authToken) return res.json({ error: "User not authenticated" });
  req.token = authToken;
  next();
};

export default authMiddleware;
