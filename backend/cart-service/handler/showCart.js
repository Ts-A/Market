import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { authUser } from "../helper/index.js";

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

    const formattedCart = {
      products: cart.products.map((item) => {
        if (item.product.stock >= item.quantity) {
          const addItemToCheckout = {
            ...item.product,
            expected: item.quantity,
            available: item.product.stock,
          };
          delete addItemToCheckout["stock"];
          return addItemToCheckout;
        } else {
          const addItemToCheckout = {
            ...item.product,
            expected: item.quantity,
            available: item.product.stock,
          };
          delete addItemToCheckout["stock"];
          return addItemToCheckout;
        }
      }),
    };

    callback(null, formattedCart);
  } catch (error) {
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
