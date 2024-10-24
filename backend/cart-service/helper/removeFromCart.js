import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

const ALLoWED_ROLES = ["user", "system"];

export default async (call, callback) => {
  try {
    const { token, quantity, productId } = call.request;

    if (!token) throw new Error("No token found");

    // check for role, session
    let decoded = jwt.verify(token, "secret");

    if (decoded.role !== "user") throw new Error("Only accessible for users");

    if (!(await redis.sIsMember(decoded.id, decoded.sessionId)))
      throw new Error("Session has expired");

    const cart = await db.cart.findUnique({
      where: {
        userId: decoded.id,
      },
      select: {
        id: true,
      },
    });

    if (!cart) throw new Error("No cart found");

    let productInCart = await db.cartProduct.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!productInCart) {
      return callback({
        code: GRPC_STATUS.PERMISSION_DENIED,
        details: "No product found",
      });
    }

    if (productInCart.quantity > quantity) {
      await db.cartProduct.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        data: {
          quantity: { decrement: quantity },
        },
      });
    } else {
      await db.cartProduct.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });
    }

    callback(null, { message: "Removed from cart" });
  } catch (error) {
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
