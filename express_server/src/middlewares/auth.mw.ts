import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/security/jwt";
import { Role } from "../models/account.model";
import { forbaseidden, unauthorized } from "../utils/configs/res";
import { AuthCache } from "../modules/auth/auth.cache";

export const authenticate = (allowedRoles?: Role | Role[]): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json(unauthorized(null, "Missing or invalid token"));
      }

      const token = authHeader.split(" ")[1];

      // 1. Check token blacklist
      const blacklisted = await AuthCache.isAccessTokenBlacklisted(token);
      if (blacklisted) {
        return res
          .status(401)
          .json(unauthorized(null, "Token has been revoked"));
      }

      // 2. Decode token
      const data = decodeToken(token);
      if (!data?.payload?.id) {
        return res.status(401).json(unauthorized(null, "Invalid token"));
      }

      // 3. Gắn user vào request
      req.user = data.payload;

      // 4. Check role nếu có yêu cầu
      if (allowedRoles) {
        const allowed = Array.isArray(allowedRoles)
          ? allowedRoles
          : [allowedRoles];
        const role = req.user.role;

        const isAllowed =
          allowed.includes(role) ||
          (allowed.includes(Role.ADMIN) && role === Role.OWNER);

        if (!isAllowed) {
          return res
            .status(403)
            .json(forbaseidden(null, "Insufficient permissions"));
        }
      }

      next();
    } catch (err) {
      return res.status(401).json(unauthorized(null, "Unauthorized"));
    }
  };
};
