import { NextFunction, Request, Response } from "express";

import logger from "../utils/configs/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now(); // Ghi lại thời gian bắt đầu xử lý request

  res.on("finish", () => {
    // Lắng nghe sự kiện kết thúc request
    const duration = Date.now() - start;
    logger.request(
      req.method,
      req.url,
      res.statusCode,
      `${duration * 1000}ms`,
      `${req.user ? "authenticated" : "anonymous"}`
    );
  });

  next();
};

export default requestLogger;
