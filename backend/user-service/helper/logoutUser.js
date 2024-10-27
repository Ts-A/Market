import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  try {
    const token = call.metadata.get("authorization")[0];

    if (!token) throw new Error("Requires an authorization to access.");

    const authToken = token.split("Bearer ")[1];

    const userPayload = jwt.verify(authToken, "secret");
    if (!(await redis.sIsMember(userPayload.id, userPayload.sessionId)))
      throw new Error("Session has expired.");

    await redis.sRem(userPayload.id, userPayload.sessionId);

    callback(null, { message: "Logged out" });
  } catch (error) {
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
