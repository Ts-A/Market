import { v4 as uuidv4 } from "uuid";
import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  try {
    const { userId } = call.request;

    // check for system role

    if (!userId) throw new Error("Required user id");

    const cart = await db.cart.findFirst({
      where: {
        userId,
      },
    });

    if (cart)
      callback(null, { message: "cart exists for user", cartId: cart.id });

    const newCart = await db.cart.create({
      data: {
        id: uuidv4(),
        userId,
      },
    });

    if (!newCart) throw new Error("Unable to create a cart");

    console.log(newCart);

    callback(null, { message: "cart created", cartId: newCart.id });
  } catch (error) {
    callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
