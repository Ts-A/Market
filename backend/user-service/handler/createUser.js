import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import { v4 as uuidv4 } from "uuid";
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";
import { createCart } from "../helper/index.js";

export default async (call, callback) => {
  try {
    const { name, email, role, password } = call.request;

    if (!name || !email || !role || !password)
      throw new Error("Required fields: name, email, role, password");

    const existingUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) throw new Error("User with email already exists.");

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
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) throw new Error("Unable to create a user");

    const userPayload = {
      role: user.role,
      id: user.id,
      sessionId: uuidv4(),
    };

    if (user.role === "user") {
      userPayload.cartId = await createCart(user.id);
    }

    const token = jwt.sign(userPayload, "secret");

    await redis.sAdd(user.id, userPayload.sessionId);

    callback(null, { token });
  } catch (error) {
    callback({ code: GRPC_STATUS.CANCELLED, details: error.message });
  }
};
