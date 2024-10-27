import db from "../configs/PrismaClient.js";
import { v4 as uuidv4 } from "uuid";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";
import { authUser } from "../helper/index.js";

const ALLOWED_ROLES = ["admin"];

export default async (call, callback) => {
  try {
    const { category, price, stock, name } = call.request;

    await authUser(call.metadata, ALLOWED_ROLES);

    const product = await db.product.create({
      data: {
        id: uuidv4(),
        category,
        name,
        price,
        stock,
      },
    });

    if (!product) throw new Error("Unable to create a product");

    return callback(null, product);
  } catch (error) {
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
