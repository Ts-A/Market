import { status as GRPC_STATUS } from "@grpc/grpc-js";
import db from "../configs/PrismaClient.js";
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";
import { v4 as uuidV4 } from "uuid";

export default async (call, callback) => {
  try {
    const { email, password } = call.request;

    if (!email || !password)
      throw new Error("Required fields: email, password");

    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user || !brcypt.compareSync(password, user.password))
      throw new Error("Invalid credentials");

    const sessionId = uuidV4();

    const token = jwt.sign(
      { role: user.role, id: user.id, sessionId },
      "secret"
    );

    await redis.sAdd(user.id, sessionId);

    callback(null, { token });
  } catch (error) {
    callback({ code: GRPC_STATUS.PERMISSION_DENIED, details: error.message });
  }
};
