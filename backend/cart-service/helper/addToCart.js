import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";

const ALLoWED_ROLES = ["user", "system"];

export default async (call, callback) => {
  try {
    const { token, quantiy, productId } = call.request;

    if (!token) throw new Error("No token found");

    const decoded = jwt.verify(token, "secret");

    // check for role, session

    const userId = decoded.userId;

    const cart = await db.cart.findUnique({
      where: {
        userId,
      },
      include: {
        products: {
          product: true,
        },
      },
    });

    console.log(cart);

    if (!cart) throw new Error("Cart not found");

    // let productInCart = await db.cartProduct.findFirst({
    //   where: {
    //     cartId: cart.id,
    //     productId: productId,
    //   },
    // });

    // if (!productInCart) {
    //   productInCart = await db.cartProduct.create({
    //     data: {
    //       cartId: cart.id,
    //       productId: productId,
    //       quantiy,
    //     },
    //   });
    // } else {
    //   await db.cartProduct.update({
    //     where: {
    //       cartId: cart.id,
    //       productId: productId,
    //       quantiy: productInCart.quantiy + quantiy,
    //     },
    //   });
    // }

    callback(null, { message: "Added to cart" });
  } catch (error) {
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
