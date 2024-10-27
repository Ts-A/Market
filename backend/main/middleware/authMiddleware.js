import { Metadata } from "@grpc/grpc-js";

const authMiddleware = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (!authToken)
    return res.json({ error: "Requires an authorization to access the url." });
  const metadata = new Metadata();
  metadata.add("authorization", authToken);
  req.grpcMetadata = metadata;
  next();
};

export default authMiddleware;
