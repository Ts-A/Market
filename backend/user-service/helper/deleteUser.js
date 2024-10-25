import db from "../configs/PrismaClient.js";
import { status as GRPC_STATUS } from "@grpc/grpc-js";
import jwt from "jsonwebtoken";
import redis from "../configs/RedisClient.js";
import cartClient from "../configs/CartClient.js";

const deleteCart = (userId, cartId) => {
  console.log(userId, cartId);
  return new Promise((resolve, reject) => {
    cartClient.deleteCart({ userId, cartId }, (err, data) => {
      if (err) {
        console.log(err);
        reject("Unable to delete cart for the user");
      }

      resolve(data);
    });
  });
};

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
    if (!(await redis.sIsMember(decoded.id, decoded.sessionId))) {
      return callback({
        code: GRPC_STATUS.UNAUTHENTICATED,
        details: "user session expired",
      });
    }
  } catch (error) {
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "Invalid user token",
    });
  }

  const response = await deleteCart(decoded.id, decoded.cartId);

  const user = await db.user.delete({
    where: {
      id: decoded.id,
    },
  });

  if (!user)
    return callback({
      code: GRPC_STATUS.NOT_FOUND,
      details: "No user found",
    });

  await redis.del(decoded.id);

  console.log(response);
  callback(null, { message: "User successfully deleted" });
};
