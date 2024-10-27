import { createClient } from "redis";

const redis = await createClient()
  .connect()
  .then((r) => {
    console.log("Connected to redis from users service");
    return r;
  })
  .catch((e) =>
    console.log("Unable to connect to redis from users microservice")
  );

export default redis;
