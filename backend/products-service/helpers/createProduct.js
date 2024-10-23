import db from "../configs/PrismaClient.js";
import { v4 as uuidv4 } from "uuid";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  const { category, price, stock, name, token } = call.request;

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

  const product = await db.product.create({
    data: {
      id: uuidv4(),
      category,
      name,
      price,
      stock,
    },
  });

  if (!product)
    return callback({ code: status.ABORTED, details: "Something went wrong" });

  return callback(null, product);
};
