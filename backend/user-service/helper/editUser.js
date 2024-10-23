import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

// TODO: Implement edit user
export default async (call, callback) => {
  const { token: authToken, email, name } = call.request;

  if (!authToken)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "No token",
    });

  var decoded;

  try {
    decoded = jwt.verify(authToken, "secret");
  } catch (error) {
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "Invalid user token",
    });
  }

  if (!(await redis.sIsMember(decoded.id, decoded.sessionId))) {
    return callback({
      code: GRPC_STATUS.UNAUTHENTICATED,
      details: "user session expired",
    });
  }

  //   let updateData = {}

  const user = await db.user.update({
    where: {
      id: decoded.id,
    },
    data: {},
  });

  if (!user)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "No user found",
    });

  callback(null, user);
};
