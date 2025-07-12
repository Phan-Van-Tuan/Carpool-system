import { Router } from "express";
import { authenticate } from "../../middlewares/auth.mw";
import { exponentPushToken, testSendNotification } from "./orther.controller";
import { asyncHandler } from "../../middlewares/asyncHandler.mw";

const router = Router();

router.post(
  "/device/register",
  authenticate(),
  asyncHandler(exponentPushToken)
);

router.post("/notification/send", asyncHandler(testSendNotification));

export default router;
