import { createClient } from "redis";

const redis = await createClient()
  .connect()
  .then(() => console.log("Connected to redis from cart service"))
  .catch((e) =>
    console.log("Unable to connect to redis from cart microservice")
  );

export default redis;
