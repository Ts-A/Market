import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  const { token: authToken } = call.request;

  if (!authToken)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "No token",
    });

  var decoded;

  try {
    decoded = jwt.verify(authToken, "secret");
    if (!(await redis.sIsMember(decoded.id, decoded.sessionId))) {
      return callback({
        code: GRPC_STATUS.UNAUTHENTICATED,
        details: "user session expired",
      });
    }
  } catch (error) {
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "Invalid user token",
    });
  }

  await redis.sRem(decoded.id, decoded.sessionId);

  callback(null, { message: "logged out" });
};
