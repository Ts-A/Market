import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";

export default async (call, callback) => {
  try {
    const products = await db.product.findMany({});

    callback(null, { products });
  } catch (error) {
    callback({ code: GRPC_STATUS.NOT_FOUND, details: "Something went wrong" });
  }
};
