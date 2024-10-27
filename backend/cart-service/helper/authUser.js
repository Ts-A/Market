import redis from "../configs/RedisClient.js";
import jwt from "jsonwebtoken";

export default (metadata, ALLOWED_ROLES) => {
  return new Promise(async (resolve, reject) => {
    if (!metadata.get("authorization")[0])
      return reject({ message: "Requires an authorization token" });

    const authToken = metadata.get("authorization")[0].split("Bearer ")[1];

    if (!authToken)
      return reject({
        message: "Authorization token must be of the form 'Bearer <token>'",
      });

    const userPayload = jwt.verify(authToken, "secret");

    if (!ALLOWED_ROLES.includes(userPayload.role))
      return reject({ message: "Unauthorized" });

    if (!(await redis.sIsMember(userPayload.id, userPayload.sessionId)))
      return reject({ message: "Session has expired" });

    return resolve(userPayload);
  });
};
