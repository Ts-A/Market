import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

const ALLOWED_ROLES = ["user", "system"];
const ALLOWED_UPDATES = ["email", "name"];

// TODO: Implement edit user
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

    let updateData = {};

    for (let [key, value] of Object.entries(call.request)) {
      if (!ALLOWED_UPDATES.includes(key)) continue;

      /**
       * Todo email unique verification logic before update
       */
      if (key == "email") {
        continue;
      }

      updateData[key] = value;
    }

    console.log(updateData);

    const user = await db.user.update({
      where: {
        id: userPayload.id,
      },
      data: {
        ...updateData,
      },
    });

    if (!user) throw new Error("No user found");

    callback(null, { message: "User updated" });
  } catch (error) {
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
