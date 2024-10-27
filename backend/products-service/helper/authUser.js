import redis from "../configs/RedisClient.js";
import jwt from "jsonwebtoken";

export default (token, ALLOWED_ROLES) => {
  return new Promise(async (resolve, reject) => {
    if (!token) reject(new Error("Requires an authorization token"));

    const authToken = token.split("Bearer ")[1];

    if (!authToken)
      reject(
        new Error("Authorization token must be of the form 'Bearer <token>'")
      );

    const userPayload = jwt.verify(authToken, "secret");

    if (!ALLOWED_ROLES.includes(userPayload.role))
      reject(new Error("Unauthorized"));

    if (!(await redis.sIsMember(userPayload.id, userPayload.sessionId)))
      reject(new Error("Session has expired"));

    resolve(userPayload);
  });
};
