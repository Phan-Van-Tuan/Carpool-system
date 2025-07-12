import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import logger from "../utils/configs/logger";
import { AppError } from "../utils/configs/appError";

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.error(err + "");
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }

  return res.status(500).json({
    success: false,
    status: 500,
    message: "Internal server error",
    data: null,
    errors: err.stack || err.message,
  });
};

export { errorHandler };
