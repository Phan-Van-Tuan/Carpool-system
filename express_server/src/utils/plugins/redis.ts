import { createClient } from "redis";
import logger from "../configs/logger";
import config from "../configs/variable";

const redisClient = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
});

redisClient.on("error", (err) => logger.error(" Redis error: " + err));

redisClient
  .connect()
  .then(() => {
    logger.success("👌 Redis connected successfully!");
  })
  .catch((err) => {
    logger.error(" Redis connection error: " + err);
    process.exit(1);
  });

export default redisClient;
