import express from "express";
import * as Controller from "./driver.controller";
import * as Schema from "./driver.schema";
import { asyncHandler } from "../../middlewares/asyncHandler.mw";
import { Role } from "../../models/account.model";
import { authenticate } from "../../middlewares/auth.mw";
import { validateBody } from "../../middlewares/validate.mw";

const router = express.Router();

router.post(
  "/register",
  // validateBody(Schema.driverRegistration),
  asyncHandler(Controller.register)
);

router.patch(
  "/update",
  authenticate(Role.DRIVER),
  validateBody(Schema.updateDriver),
  asyncHandler(Controller.update)
);

router.patch(
  "/admin/update/:driverId",
  authenticate(Role.ADMIN),
  asyncHandler(Controller.adminUpdate)
);

router.get("/history", authenticate(), asyncHandler(Controller.getTripHistory));
router.get(
  "/trip/upcoming",
  authenticate(),
  asyncHandler(Controller.getUpcomingTrip)
);
router.post(
  "/trip/:id/start",
  authenticate(),
  asyncHandler(Controller.startTrip)
);
router.post(
  "/trip/:id/finish",
  authenticate(),
  asyncHandler(Controller.finishTrip)
);
router.get("/trip/:id", authenticate(), asyncHandler(Controller.getTripDetail));

router.get("/me", authenticate(Role.DRIVER), asyncHandler(Controller.getMe));

export default router;
