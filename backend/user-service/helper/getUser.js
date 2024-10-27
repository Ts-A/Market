import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

const ALLOWED_ROLES = ["user", "system"];

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

    const user = await db.user.findFirst({
      where: {
        id: userPayload.id,
        role: userPayload.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) throw new Error("No user found.");

    callback(null, user);
  } catch (error) {
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
