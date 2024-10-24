import { v4 as uuidv4 } from "uuid";
import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  try {
    const { token } = call.request;
    if (!token) throw new Error("Not authorized");

    let decoded = jwt.verify(token, "secret");

    // check for system role

    const cart = await db.cart.findFirst({
      where: {
        userId: decoded.id,
      },
    });

    if (cart) callback(null, { cart });

    const newCart = await db.cart.create({
      data: {
        id: uuidv4(),
        userId: decoded.id,
      },
    });

    callback(null, { newCart });
  } catch (error) {
    callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
