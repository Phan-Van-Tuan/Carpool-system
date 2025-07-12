import { Router } from "express";
import { AccountController } from "./account.controller";
import { authenticate } from "../../middlewares/auth.mw";
import { validateBody } from "../../middlewares/validate.mw";
import { AccountSchemas } from "./account.schema";
import { asyncHandler } from "../../middlewares/asyncHandler.mw";
import { Role } from "../../models/account.model";

const router = Router();

router.use(authenticate());

router.get("/profile", asyncHandler(AccountController.getProfile));

router.put(
  "/update",
  validateBody(AccountSchemas.updateProfile),
  asyncHandler(AccountController.updateProfile)
);
router.patch(
  "/update-avatar",
  validateBody(AccountSchemas.updateAvatar),
  asyncHandler(AccountController.updateAvatar)
);
router.put(
  "/admin/update/:id",
  authenticate(Role.ADMIN),
  validateBody(AccountSchemas.adminUpdate),
  asyncHandler(AccountController.adminUpdate)
);
router.get("/activity", asyncHandler(AccountController.getActivity));

export default router;
