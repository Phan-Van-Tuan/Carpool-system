import mongoose from "mongoose";
import config from "../configs/variable";
import logger from "../configs/logger";

const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    // mongoose.set("debug", true);
    // console.log("🔍 Mongo URI:", config.MONGO_URI);
    await mongoose.connect(config.MONGO_URI);
    logger.success("😎 Database connected successfully!");
  } catch (error) {
    logger.error("Database connection failed\n" + error);
    process.exit(1);
  }
};

export default connectDatabase;
