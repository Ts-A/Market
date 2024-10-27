import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";
import { authUser } from "../helper/index.js";

export default async (call, callback) => {
  try {
    const userPayload = await authUser(call.metadata, ALLOWED_ROLES);

    await redis.sRem(userPayload.id, userPayload.sessionId);

    callback(null, { message: "Logged out" });
  } catch (error) {
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
