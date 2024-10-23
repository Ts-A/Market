import { status as STATUS } from "@grpc/grpc-js";
import db from "../configs/PrismaClient.js";

export default async (call, callback) => {
  const productId = call.request.id;

  if (!productId)
    callback({
      code: STATUS.INVALID_ARGUMENT,
      details: "Product id required",
    });

  const product = await db.product.findFirst({
    where: {
      id: productId,
    },
  });

  if (!product)
    callback({ code: STATUS.NOT_FOUND, details: "Product id invalid" });

  callback(null, product);
};
