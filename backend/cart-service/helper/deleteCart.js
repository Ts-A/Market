import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";

export default async (call, callback) => {
  try {
    const { userId, cartId } = call.request;

    // check for system role

    if (!userId) throw new Error("Required user id");

    const cartProducts = await db.cartProduct.deleteMany({
      where: {
        cartId: cartId,
      },
    });

    const cart = await db.cart.delete({
      where: {
        id: cartId,
      },
    });

    callback(null, { message: "cart deleted", cartId: cart.id });
  } catch (error) {
    callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
