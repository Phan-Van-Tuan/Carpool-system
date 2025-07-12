import _Booking, { EBookingStatus, IBooking } from "../../models/booking.model";
import _Config from "../../models/config.model";
import { AppError } from "../../utils/configs/appError";
import { Waypoint } from "../../utils/types/location";
import _Trip from "../../models/trip.model";
import { ETranferStatus } from "../../models/transaction.model";
import _Vehicle from "../../models/vehicle.model";
import { getDistanceMatrix } from "../../utils/plugins/map";
import {
  calculatePrice,
  optimizeWaypointsGreedy,
  summarizeWaypointsByBooking,
} from "../../utils/core";
import mongoose from "mongoose";

export const getBookingByRiderId = async (riderId: string) => {
  const bookings = await _Booking
    .find({ customerId: riderId })
    .sort({ createdAt: -1 });

  // Tìm booking đang process
  const activeBooking = bookings.find((b) => b.status === "process");
  let activeTrip;
  if (activeBooking) {
    activeTrip = await _Trip.findOne({ bookings: activeBooking._id });
  }
  return { bookings, size: bookings.length, activeTripId: activeTrip?._id };
};

export const createBooking = async (
  customerId: mongoose.Types.ObjectId,
  tripId: string,
  booking: Partial<IBooking>
) => {
  // Lấy trip để kiểm tra và lấy thông tin chuẩn
  const trip = await _Trip.findById(tripId);
  if (!trip) throw new AppError("Trip not found", 404);
  if (!booking.pickup || !booking.dropoff)
    throw new AppError("Pickup and dropoff are required", 400);
  if (!booking.paymentMethod)
    throw new AppError("Payment method is required", 400);

  // Khởi tạo session cho transaction
  const session = await _Booking.startSession();
  try {
    let newBooking;
    await session.withTransaction(async () => {
      newBooking = new _Booking(booking);
      // Chuẩn bị danh sách waypoints hiện tại từ trip
      const currentWaypoints: Waypoint[] = trip.waypoints || [];

      // Thêm pickup và dropoff mới
      const newWaypoints: Waypoint[] = [
        ...currentWaypoints,
        {
          location: newBooking.pickup,
          bookingId: newBooking._id,
          type: "pickup",
        } as Waypoint,
        {
          location: newBooking.dropoff,
          bookingId: newBooking._id,
          type: "dropoff",
        } as Waypoint,
      ];

      // console.log("New waypoints:", newWaypoints);
      const optimizedWaypoints = optimizeWaypointsGreedy(
        trip.startLocation,
        trip.endLocation,
        newWaypoints
      );
      // console.log("Optimized waypoints:", optimizedWaypoints);

      // Gọi Goong Distance Matrix API để lấy ma trận khoảng cách và thời gian
      const {
        updatedWaypoints,
        totalDistance: tripDistance,
        totalDuration: tripDuration,
      } = await getDistanceMatrix(optimizedWaypoints, trip.startLocation);

      // console.log("Optimized waypoints:", optimizedWaypoints);

      const bookingStats = summarizeWaypointsByBooking(
        updatedWaypoints,
        newBooking._id as string
      );

      if (!booking.passengers || booking.passengers < 1)
        throw new AppError("Invalid passenger count", 400);

      // Cập nhật các field cho booking
      newBooking.customerId = customerId;
      newBooking.distance = bookingStats[0].totalDistance;
      newBooking.duration = bookingStats[0].totalDuration;
      newBooking.departure = booking.departure || trip.departure;
      newBooking.price =
        booking.price ??
        (
          await calculatePrice(
            bookingStats[0].totalDistance,
            booking.passengers
          )
        ).totalPrice;

      // Các trường khác nếu cần
      newBooking.status = booking.status || EBookingStatus.PENDING;
      newBooking.paymentStatus =
        booking.paymentStatus || ETranferStatus.PENDING;

      // Lưu booking vào DB
      await newBooking.save({ session });

      // Cập nhật trip với booking mới và waypoints tối ưu
      await _Trip.findByIdAndUpdate(
        tripId,
        {
          $push: { bookings: newBooking._id },
          $set: {
            waypoints: optimizedWaypoints,
            distance: tripDistance,
            duration: tripDuration,
          },
        },
        { session }
      );
    });

    return newBooking;
  } catch (error) {
    throw new AppError(`Failed to create booking: ${error}`, 500);
  } finally {
    await session.endSession();
  }
};

// Tính giá (giả định)
