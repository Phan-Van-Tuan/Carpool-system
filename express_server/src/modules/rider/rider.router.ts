import { Router } from "express";
import { authenticate } from "../../middlewares/auth.mw";
import * as Controller from "./rider.controller";
import { asyncHandler } from "../../middlewares/asyncHandler.mw";

const router = Router();

// Ride Requests
router.post(
  "/booking/matching-trips",
  authenticate(),
  asyncHandler(Controller.matchingTrips)
);

router.post(
  "/booking/create",
  authenticate(),
  asyncHandler(Controller.createRideRequest)
);
router.get(
  "/bookings",
  authenticate(),
  asyncHandler(Controller.listRideBookings)
);
router.get(
  "/bookings/:id",
  authenticate(),
  asyncHandler(Controller.getRideRequestDetail)
);
router.delete(
  "/bookings/:id",
  authenticate(),
  asyncHandler(Controller.cancelRideRequest)
);

// Rides
router.get("/rides", authenticate(), asyncHandler(Controller.listRides));
router.get(
  "/rides/:id",
  authenticate(),
  asyncHandler(Controller.getRideDetail)
);
router.get(
  "/status",
  authenticate(),
  asyncHandler(Controller.getCurrentStatus)
);

// Feedback
router.post(
  "/rides/:id/feedback",
  authenticate(),
  asyncHandler(Controller.sendFeedback)
);

// Payment
router.post(
  "/payment/create",
  authenticate(),
  asyncHandler(Controller.createPayment)
);
router.get("/payment/vnpay-return", asyncHandler(Controller.vnpayReturn));
router.get("/payment/momo-return", asyncHandler(Controller.momoReturn));
router.post("/payment/vnpay-ipn", asyncHandler(Controller.vnpayIPN));
router.post("/payment/momo-ipn", asyncHandler(Controller.momoIPN));

export default router;
