import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";

export default async (call, callback) => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return callback(null, { users });
  } catch (error) {
    return callback({
      code: GRPC_STATUS.INVALID_ARGUMENT,
      details: "Something went wrong",
    });
  }
};
