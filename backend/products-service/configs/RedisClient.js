import { createClient } from "redis";

const redis = await createClient()
  .connect()
  .then(() => console.log("Connected to redis from product service"))
  .catch((e) =>
    console.log("Unable to connect to redis from products microservice")
  );

export default redis;
