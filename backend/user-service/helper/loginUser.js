import { status as GRPC_STATUS } from "@grpc/grpc-js";
import db from "../configs/PrismaClient.js";
import brcypt from "bcrypt";

export default async (call, callback) => {
  const { email, password } = call.request;

  if (!email || !password)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "Mandatory fields are required",
    });

  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (!brcypt.compareSync(password, user.password))
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: "Invalid credentials",
    });

  callback(null, user);
};
