import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { authUser } from "../helper/index.js";

const ALLOWED_ROLES = ["user", "system"];

export default async (call, callback) => {
  try {
    const userPayload = await authUser(call.metadata, ALLOWED_ROLES);

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
    console.log(error);
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: error.message,
    });
  }
};
