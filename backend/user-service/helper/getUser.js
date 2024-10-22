import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";

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
  } catch (error) {
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "Invalid user token",
    });
  }

  const user = await db.user.findFirst({
    where: {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    },
  });

  if (!user)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "No user found",
    });

  callback(null, user);
};
