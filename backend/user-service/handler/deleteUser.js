import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import redis from "../configs/RedisClient.js";

import { deleteCart, authUser } from "../helper/index.js";

const ALLOWED_ROLES = ["user", "system"];

export default async (call, callback) => {
  try {
    const userPayload = await authUser(
      call.metadata.get("authorization")
        ? call.metadata.get("authorization")[0]
        : "",
      ALLOWED_ROLES
    );

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
