import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { authUser } from "../helper/index.js";

const ALLOWED_ROLES = ["user"];

export default async (call, callback) => {
  try {
    const { token, quantity, productId } = call.request;

    const userPayload = await authUser(call.metadata, ALLOWED_ROLES);

    const cart = await db.cart.findUnique({
      where: {
        userId: userPayload.id,
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
          productId: productId,
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
