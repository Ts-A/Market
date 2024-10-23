import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { v4 as uuidv4 } from "uuid";
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";

export default async (call, callback) => {
  const { name, email, role, password } = call.request;

  if (!name || !email || !role || !password)
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: "missing fields required",
    });

  const existingUser = await db.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser)
    return callback({
      code: GRPC_STATUS.ALREADY_EXISTS,
      details: "user with email already exists",
    });

  const SALT = brcypt.genSaltSync(+process.env.SALT_ROUNDS);
  const brcyptPassword = brcypt.hashSync(password, SALT);

  const user = await db.user.create({
    data: {
      id: uuidv4(),
      name,
      email,
      role,
      password: brcyptPassword,
    },
  });

  if (!user)
    callback({ code: GRPC_STATUS.UNKNOWN, details: "something went wrong" });

  const sessionId = uuidv4();

  const token = jwt.sign(
    { email: user.email, role: user.role, id: user.id, sessionId },
    "secret"
  );

  await redis.sAdd(user.id, sessionId);

  callback(null, { token });
};
