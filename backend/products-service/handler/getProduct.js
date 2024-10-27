import { status as GRPC_STATUS } from "@grpc/grpc-js";
import db from "../configs/PrismaClient.js";

export default async (call, callback) => {
  try {
    const { id } = call.request;

    if (!id) throw new Error("Missing fields: id");

    const product = await db.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) throw new Error("Product not found");

    callback(null, product);
  } catch (error) {
    callback({ code: GRPC_STATUS.NOT_FOUND, details: error.message });
  }
};
