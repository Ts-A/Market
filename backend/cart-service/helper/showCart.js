import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  try {
    const { token } = call.request;
    if (!token) throw new Error("Not authorized");

    let decoded = jwt.verify(token, "secret");

    if (decoded.role !== "user") throw new Error("Only accessible for users");

    if (!(await redis.sIsMember(decoded.id, decoded.sessionId)))
      throw new Error("Session has expired");

    const cart = await db.cart.findFirst({
      where: {
        userId: decoded.id,
      },
    });

    if (!cart) throw new Error("No cart found");

    callback(null, { cart });
  } catch (error) {
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
