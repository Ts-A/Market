const authMiddleware = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (!authToken)
    return res.json({ error: "Requires an authorization to access the url." });
  req.token = authToken;
  next();
};

export default authMiddleware;
