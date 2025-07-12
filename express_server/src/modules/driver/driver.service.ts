import _Driver from "../../models/driver.model";
import _Vehicle from "../../models/vehicle.model";
import _Account, { AStatus, IAccount } from "../../models/account.model";
import _Trip from "../../models/trip.model";
import { AppError } from "../../utils/configs/appError";
import {
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import _Booking, { EBookingStatus, IBooking } from "../../models/booking.model";
import _PushToken from "../../models/push.model";
import { sendPushNotification } from "../other/push.service";
import { finishBooking } from "../other/other.service";
import bcrypt from "bcryptjs";
import config from "../../utils/configs/variable";

import mongoose from "mongoose";

export const registerDriver = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await _Account
      .findOne({
        phone: data.phone,
        role: data.role,
      })
      .session(session);

    if (existing) {
      throw new Error("Phone number already registered");
    }

    const hashed = await bcrypt.hash(data.password, config.SALT);

    const account = await _Account.create(
      [
        {
          ...(data as IAccount),
          password: hashed,
          status: AStatus.PENDING,
        },
      ],
      { session }
    );

    const driver = await _Driver.create(
      [
        {
          accountId: account[0]._id,
          number: data.number,
          documents: data.documents.map((doc: any) => ({
            ...doc,
            status: "pending",
            verified: { phone: true },
          })),
        },
      ],
      { session }
    );

    const vehicle = await _Vehicle.create(
      [
        {
          ...data.vehicle,
          driverId: driver[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { driver: driver[0], vehicle: vehicle[0], account: account[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getDriverStatus = async (accountId: string) => {
  const driver = await _Driver.findOne({ accountId });

  if (!driver) return "not_registered";

  const statuses = driver.documents.map((d) => d.status);

  if (statuses.includes("rejected")) return "rejected";
  if (statuses.includes("pending")) return "pending";

  return "approved";
};

export const updateDriver = async (accountId: string, update: any) => {
  const driver = await _Driver.findOne({ accountId });
  if (!driver) throw new Error("Driver not found");

  if (update.number) driver.number = update.number;
  if (update.documents) {
    driver.documents = update.documents.map((doc: any) => ({
      ...doc,
      status: update.status || "pending", // cập nhật lại => chờ duyệt lại
    }));
  }

  await driver.save();

  if (update.vehicle) {
    const vehicle = await _Vehicle.findOne({ driverId: driver._id });
    if (!vehicle) throw new Error("Vehicle not found");

    Object.assign(vehicle, update.vehicle);
    await vehicle.save();
  }

  return { driver };
};

export const getDriverProfile = async (accountId: string) => {
  // Lấy driver theo accountId
  const driver = await _Driver.findOne({ accountId }).lean();
  if (!driver) throw new Error("Driver not found");

  // Lấy account
  const account = await _Account.findById(accountId).lean();

  // Lấy vehicle
  const vehicle = await _Vehicle.findOne({ driverId: driver._id }).lean();

  return {
    account,
    earnings: {
      today: 0,
      week: 0,
      month: 0,
      total: 0,
    },
    documents: driver,
    vehicle,
  };
};

// export const getTripHistory = async (
//   driverId: string,
//   period: string = "week",
//   offset: number = 0
// ) => {
//   const now = new Date();

//   const range =
//     period === "month"
//       ? [
//           startOfMonth(addMonths(now, offset)),
//           endOfMonth(addMonths(now, offset)),
//         ]
//       : [
//           startOfWeek(addWeeks(now, offset), { weekStartsOn: 1 }),
//           endOfWeek(addWeeks(now, offset), { weekStartsOn: 1 }),
//         ];
//   const driver = await _Driver.findOne({ accountId: driverId });
//   if (!driver) throw new AppError("Driver not found", 404);
//   return await _Trip
//     .find({
//       driverId: driver._id,
//       status: "completed",
//       departure: { $gte: range[0], $lte: range[1] },
//     })
//     .sort({ departure: -1 })
//     .populate({
//       path: "bookings",
//       populate: {
//         path: "customerId",
//         model: "Account",
//       },
//     })
//     .lean();
// };

export const getTripHistory = async (
  driverId: string,
  period: string = "week",
  offset: number = 0
) => {
  const driver = await _Driver.findOne({ accountId: driverId });
  if (!driver) throw new AppError("Driver not found", 404);

  return await _Trip
    .find({
      driverId: driver._id,
    })
    .sort({ departure: -1 })
    .populate({
      path: "bookings",
      populate: {
        path: "customerId",
        model: "Account",
      },
    })
    .lean();
};

export const getUpcomingTrip = async (driverId: string) => {
  const driver = await _Driver.findOne({ accountId: driverId });
  if (!driver) throw new AppError("Driver not found", 404);
  return await _Trip
    .findOne({
      driverId: driver._id,
      status: "scheduled",
      departure: { $gte: new Date() },
    })
    .sort({ departure: 1 })
    .populate({
      path: "bookings",
      populate: {
        path: "customerId",
        model: "Account",
      },
    })
    .lean();
};

export const startTrip = async (tripId: string) => {
  const trip = await _Trip.findById(tripId).populate({
    path: "bookings",
    populate: {
      path: "customerId",
      model: "Account",
    },
  });
  if (!trip) throw new AppError("Trip not found", 404);
  if (trip.status !== "scheduled")
    throw new AppError("Trip already started or invalid status", 400);

  trip.status = "in_progress";
  trip.history += `\nStarted at ${new Date().toISOString()}`;
  await trip.save();

  const bookingIds = trip.bookings.map((b: any) => b._id);
  await _Booking.updateMany(
    { _id: { $in: bookingIds } },
    { $set: { status: "process" } }
  );

  // Gửi push notification cho tất cả customer
  const customerIds = trip.bookings.map(
    (b: any) => b.customerId._id?.toString?.() || b.customerId.toString()
  );
  const pushTokens = await _PushToken
    .find({
      userId: { $in: customerIds },
    })
    .lean();
  const tokens = pushTokens.map((t) => t.token);

  await sendPushNotification({
    tokens,
    title: "Chuyến đi đã bắt đầu",
    body: "Tài xế đã bắt đầu chuyến đi của bạn.",
    data: { tripId: trip._id },
  });

  return trip;
};

export const finishTrip = async (tripId: string, note?: string) => {
  const trip = await _Trip.findById(tripId);
  if (!trip) throw new AppError("Trip not found", 404);
  if (trip.status !== "in_progress")
    throw new AppError("Trip is not active", 400);

  const bookingIds = trip.bookings.map((b: any) =>
    typeof b === "object" ? b._id : b
  );

  const bookings = await _Booking.find({
    _id: { $in: bookingIds },
  });

  const unfinishedBookings = bookings.filter((b) =>
    [EBookingStatus.PROCESS, EBookingStatus.PENDING].includes(
      b.status as EBookingStatus
    )
  );

  await Promise.all(
    unfinishedBookings.map((b) => finishBooking(b._id as string))
  );

  trip.status = "completed";
  trip.history += `\nFinished at ${new Date().toISOString()}${
    note ? ` - ${note}` : ""
  }`;
  await trip.save();

  return trip;
};

export const getTripDetail = async (driverId: string, tripId: string) => {
  const trip = await _Trip
    .findOne({ _id: tripId, driverId })
    .populate("bookings");
  if (!trip) throw new AppError("Trip not found", 404);
  return trip;
};
