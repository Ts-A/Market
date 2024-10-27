import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";
import cartClient from "../configs/CartClient.js";

const ALLOWED_ROLES = ["user", "system"];

const deleteCart = (userId) => {
  return new Promise((resolve, reject) => {
    cartClient.deleteCart({ userId, cartId: "" }, (err, data) => {
      if (err) {
        reject("Unable to delete cart for the user");
      }

      resolve(data);
    });
  });
};

export default async (call, callback) => {
  try {
    const token = call.metadata.get("authorization")[0];
    if (!token) throw new Error("Requires an authorization to access.");

    const authToken = token.split("Bearer ")[1];
    const userPayload = jwt.verify(authToken, "secret");

    if (!ALLOWED_ROLES.includes(userPayload.role))
      throw new Error("Unauthorized to access.");

    if (!(await redis.sIsMember(userPayload.id, userPayload.sessionId)))
      throw new Error("Session has expired");

    await deleteCart(userPayload.id);

    const user = await db.user.delete({
      where: {
        id: userPayload.id,
      },
    });

    if (!user) throw new Error("No user found.");

    await redis.del(userPayload.id);

    callback(null, { message: "User successfully deleted" });
  } catch (error) {
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
