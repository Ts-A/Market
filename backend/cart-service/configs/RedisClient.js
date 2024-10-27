import { createClient } from "redis";

const redis = await createClient()
  .connect()
  .then((r) => {
    console.log("Connected to redis from cart service");
    return r;
  })
  .catch((e) =>
    console.log("Unable to connect to redis from cart microservice")
  );

export default redis;
