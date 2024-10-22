import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";

export default async (call, callback) => {
  const users = await db.user.findMany({});

  if (!users)
    return callback({
      code: GRPC_STATUS.INVALID_ARGUMENT,
      details: "Something went wrong",
    });

  return callback(null, { users });
};
