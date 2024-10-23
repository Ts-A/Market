import { status as GRPC_STATUS } from "@grpc/grpc-js";
import db from "../configs/PrismaClient.js";
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";
import { v4 as uuidV4 } from "uuid";

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

  if (!user)
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: "Invalid credentials",
    });

  if (!brcypt.compareSync(password, user.password))
    return callback({
      code: GRPC_STATUS.PERMISSION_DENIED,
      details: "Invalid credentials",
    });

  const sessionId = uuidV4();

  const token = jwt.sign(
    { email: user.email, role: user.role, id: user.id, sessionId },
    "secret"
  );

  await redis.sAdd(user.id, sessionId);

  callback(null, { token });
};
