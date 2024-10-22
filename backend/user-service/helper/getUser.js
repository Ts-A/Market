import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";

export default async (call, callback) => {
  const userId = call.request.id;

  if (!userId)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "User id is required",
    });

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "User id invalid",
    });

  callback(null, user);
};
