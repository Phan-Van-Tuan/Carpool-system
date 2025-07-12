import express from "express";
import * as Controller from "./admin.controller";
import * as Schema from "./admin.schema";
import { asyncHandler } from "../../middlewares/asyncHandler.mw";
import { Role } from "../../models/account.model";
import { authenticate } from "../../middlewares/auth.mw";
import { validateBody } from "../../middlewares/validate.mw";

const router = express.Router();

router.use(authenticate(Role.ADMIN));

router.get("/account/overview", asyncHandler(Controller.getAccountOverview));

// CONFIG
router.get("/configs", asyncHandler(Controller.getConfigs));
router.post(
  "/configs/update",
  authenticate(Role.OWNER),
  asyncHandler(Controller.configPrice)
);

// route
router.get("/routes", asyncHandler(Controller.getAllRoutes));
router.post(
  "/route",
  validateBody(Schema.createRoute),
  asyncHandler(Controller.createRoute)
);
router.put(
  "/route/:id",
  validateBody(Schema.updateRoute),
  asyncHandler(Controller.updateRoute)
);
router.delete("/route/:id", asyncHandler(Controller.deleteRoute));

router.get("/assignments", asyncHandler(Controller.getAllAssignments));
router.post(
  "/assignment",
  // validateBody(Schema.createAssignment),
  asyncHandler(Controller.createAssignment)
);
router.put(
  "/assignment/:id",
  // validateBody(Schema.updateAssignment),
  asyncHandler(Controller.updateAssignment)
);
router.delete("/assignment/:id", asyncHandler(Controller.deleteAssignment));

export default router;
