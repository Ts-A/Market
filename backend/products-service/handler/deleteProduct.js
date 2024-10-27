import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  const { id, token } = call.request;

  if (!token)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "Invalid token",
    });

  var decoded;

  try {
    decoded = jwt.verify(token, "secret");
    if (decoded.role !== "admin")
      throw new Error({
        message: "Not an admin",
        code: GRPC_STATUS.PERMISSION_DENIED,
      });
    if (!(await redis.sIsMember(decoded.id, decoded.sessionId)))
      throw new Error({
        message: "Session expired",
        code: GRPC_STATUS.NOT_FOUND,
      });
  } catch (error) {
    return callback({
      code: error.code || GRPC_STATUS.NOT_FOUND,
      details: error.message || "Session expired",
    });
  }

  if (!id)
    callback({
      code: GRPC_STATUS.INVALID_ARGUMENT,
      details: "Product id required",
    });

  const product = await db.product.delete({
    where: {
      id,
    },
  });

  if (!product)
    callback({ code: GRPC_STATUS.NOT_FOUND, details: "Product id invalid" });

  callback(null, product);
};
