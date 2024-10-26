import { createClient } from "redis";

const redis = await createClient()
  .connect()
  .catch((e) =>
    console.log("Unable to connect to redis from carts microservice")
  );

export default redis;
