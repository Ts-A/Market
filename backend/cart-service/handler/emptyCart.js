import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { authUser } from "../helper/index.js";

const ALLOWED_ROLES = ["user"];

export default async (call, callback) => {
  try {
    const userPayload = await authUser(call.metadata, ALLOWED_ROLES);

    const cart = await db.cart.findUnique({
      where: {
        userId: userPayload.id,
      },
    });

    if (!cart) throw new Error("No cart found");

    await db.cartProduct.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    callback(null, { message: "Empty cart" });
  } catch (error) {
    callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
