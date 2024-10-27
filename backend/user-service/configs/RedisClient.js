import { createClient } from "redis";

const redis = await createClient()
  .connect()
  .then(() => console.log("Connected to redis from user service"))
  .catch((e) =>
    console.log("Unable to connect to redis from users microservice")
  );

export default redis;
