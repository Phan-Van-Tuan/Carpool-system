import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthSchemas } from "./auth.shema";
import { authenticate } from "../../middlewares/auth.mw";
import { validateBody } from "../../middlewares/validate.mw";
import { Role } from "../../models/account.model";
import { asyncHandler } from "../../middlewares/asyncHandler.mw";

const router = Router();

// OTP
router.post(
  "/otp/request",
  validateBody(AuthSchemas.otpRequest),
  asyncHandler(AuthController.requestOtp)
);
router.post(
  "/otp/verify",
  validateBody(AuthSchemas.otpVerify),
  asyncHandler(AuthController.verifyOtp)
);

// Auth
router.post(
  "/register",
  validateBody(AuthSchemas.register),
  asyncHandler(AuthController.register)
);
router.post(
  "/login",
  validateBody(AuthSchemas.login),
  asyncHandler(AuthController.login)
);
router.post(
  "/social-login",
  validateBody(AuthSchemas.socialLogin),
  asyncHandler(AuthController.socialLogin)
);
router.post("/refresh", asyncHandler(AuthController.refreshToken));
router.post("/logout", authenticate(), asyncHandler(AuthController.logout));
router.post(
  "/devices/logout-all",
  authenticate(),
  asyncHandler(AuthController.logoutAll)
);
router.get(
  "/devices",
  authenticate(),
  asyncHandler(AuthController.listDevices)
);

// Password
router.post(
  "/password/forgot",
  validateBody(AuthSchemas.forgotPassword),
  asyncHandler(AuthController.forgotPassword)
);
router.post(
  "/password/reset",
  validateBody(AuthSchemas.resetPassword),
  asyncHandler(AuthController.resetPassword)
);
router.patch(
  "/password/change",
  authenticate(),
  validateBody(AuthSchemas.changePassword),
  asyncHandler(AuthController.changePassword)
);

// Thông tin tài khoản
router.get("/me", authenticate(), asyncHandler(AuthController.getProfile));

// Email verify
router.post(
  "/email/verify-send",
  authenticate(),
  asyncHandler(AuthController.sendEmailVerify)
);
router.post(
  "/email/verify",
  validateBody(AuthSchemas.verifyEmail),
  asyncHandler(AuthController.verifyEmail)
);

// 2FA
router.post(
  "/2fa/enable",
  authenticate(),
  asyncHandler(AuthController.enable2FA)
);
router.post(
  "/2fa/verify",
  authenticate(),
  validateBody(AuthSchemas.verify2FA),
  asyncHandler(AuthController.verify2FA)
);
router.post(
  "/2fa/disable",
  authenticate(),
  validateBody(AuthSchemas.verify2FA),
  asyncHandler(AuthController.disable2FA)
);

// Admin routes
router.post(
  "/admin/login",
  validateBody(AuthSchemas.adminLogin),
  asyncHandler(AuthController.adminLogin)
);
router.post(
  "/admin/logout",
  authenticate([Role.ADMIN, Role.OWNER]),
  asyncHandler(AuthController.adminLogout)
);
router.post("/admin/refresh", asyncHandler(AuthController.adminRefreshToken));

// Internal (bảo vệ bằng gateway hoặc API-key middleware riêng)
router.post(
  "/internal/validate-token",
  asyncHandler(AuthController.internalValidateToken)
); // Bạn có thể gắn apiKeyGuard ở đây nếu có
router.post(
  "/internal/revoke-user/:userId",
  asyncHandler(AuthController.internalRevokeUser)
);

export default router;
