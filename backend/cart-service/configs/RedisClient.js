import { createClient } from "redis";

let redis = await createClient().connect();

try {
  if (redis) console.log("Connected to redis from carts microservice");
} catch (error) {
  console.log("Unable to connect to redis");
}

export default redis;
