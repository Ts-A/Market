import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { authUser, generateOrder } from "../helper/index.js";

const ALLOWED_ROLES = ["user", "system"];

export default async (call, callback) => {
  try {
    const userPayload = await authUser(call.metadata, ALLOWED_ROLES);

    const cart = await db.cart.findUnique({
      where: {
        userId: userPayload.id,
      },
      select: {
        products: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                price: true,
                name: true,
                category: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!cart) throw new Error("No cart found");

    for (let item of cart.products) {
      if (item.product.stock < item.quantity)
        throw new Error("Missing stock for some items");
    }

    const orderSummary = await generateOrder(cart);

    await db.cartProduct.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    callback(null, orderSummary);
  } catch (error) {
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
