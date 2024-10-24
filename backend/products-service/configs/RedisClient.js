import { createClient } from "redis";

let redis;

try {
  redis = await createClient().connect();
  if (redis) console.log("Connected to redis from products microservice");
} catch (error) {
  console.log("Unable to connect to redis");
}

export default redis;
