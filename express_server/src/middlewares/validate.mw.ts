import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/configs/appError";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.issues.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      );
      throw new AppError("Validation failed", 400, errorMessages);
    }

    req.body = result.data;
    next();
  };
};
