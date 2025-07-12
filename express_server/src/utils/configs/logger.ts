import fs from "fs";
import path from "path";
import chalk from "chalk";
import config from "./variable";

const logDir = path.join(__dirname, "../../logs");
const logFilePath = path.join(logDir, "combined.log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const isDevelopment = config.ENV !== "production";
const shouldLogToFile = !isDevelopment;

const logger = {
  logToFile: (level: string, message: string) => {
    const logMessage = `[${new Date().toISOString()}] ${level}: ${message}\n`;
    try {
      fs.appendFileSync(logFilePath, logMessage, "utf8");
    } catch (err) {
      console.error("Error writing to log file:", err);
    }
  },
  log: ({
    level,
    message,
    isLogToFile,
  }: {
    level: string;
    message: string;
    isLogToFile: boolean;
  }) => {
    console.log(message); // message đã được tô màu trước khi truyền vào
    if (isLogToFile) {
      logger.logToFile(level, message);
    }
  },
  info: (message: string) =>
    logger.log({
      level: "info",
      message:
        chalk.bgBlue("[INFO]") +
        chalk.blue(` ${message} - ${new Date().toISOString()}`),
      isLogToFile: shouldLogToFile,
    }),
  success: (message: string) =>
    logger.log({
      level: "success",
      message:
        chalk.bgGreen("[SUCCESS]") +
        chalk.green(` ${message} - ${new Date().toISOString()}`),
      isLogToFile: shouldLogToFile,
    }),
  warning: (message: string) =>
    logger.log({
      level: "warning",
      message:
        chalk.bgYellow("[WARNING]") +
        chalk.yellow(` ${message} - ${new Date().toISOString()}`),
      isLogToFile: shouldLogToFile,
    }),
  error: (message: string) =>
    logger.log({
      level: "error",
      message:
        chalk.bgRed("[ERROR]") +
        chalk.red(` ${message} - ${new Date().toISOString()}`),
      isLogToFile: shouldLogToFile,
    }),
  request: (
    method: string,
    url: string,
    statusCode: number,
    duration: string,
    info?: string
  ) =>
    logger.log({
      level: "request",
      message:
        chalk.bgMagenta("[REQUEST]") +
        chalk.white(
          ` ${method} ${url} ${statusCode} ${duration} - ${new Date().toISOString()} - ${info}`
        ),
      isLogToFile: shouldLogToFile,
    }),
};

export default logger;
