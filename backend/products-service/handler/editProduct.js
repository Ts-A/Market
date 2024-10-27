import { status as GRPC_STATUS } from "@grpc/grpc-js";
import db from "../configs/PrismaClient.js";
import { authUser } from "../helper/index.js";

const ALLOWED_UPDATES = ["category", "price", "stock", "name"];
const ALLOWED_ROLES = ["admin", "system"];

export default async (call, callback) => {
  try {
    const { id } = call.request;

    await authUser(
      call.metadata.get("authorization")
        ? call.metadata.get("authorization")[0]
        : "",
      ALLOWED_ROLES
    );

    if (!id) throw new Error("Product id required");

    const updateData = {};

    for (let [key, value] of Object.entries(call.request))
      if (ALLOWED_UPDATES.includes(key)) updateData[key] = value;

    const product = await db.product.update({
      where: {
        id,
      },
      data: { ...updateData },
    });

    if (!product) throw new Error("Product not found");
    callback(null, product);
  } catch (error) {
    callback({
      code: GRPC_STATUS.INVALID_ARGUMENT,
      details: error.message,
    });
  }
};
