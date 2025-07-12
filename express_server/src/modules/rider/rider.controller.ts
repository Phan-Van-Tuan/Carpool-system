import { Request, Response } from "express";
import * as Service from "./rider.service";
import {
  success,
  created,
  badRequest,
  serverError,
} from "../../utils/configs/res";
import { VnpService, MoMoService } from "../other/payment.service";
import * as MatchingService from "./matching.service";
import { AppError } from "../../utils/configs/appError";
import { VnpParams } from "../../utils/types/transaction";
import { ETransactionType } from "../../models/transaction.model";

const VNPS = new VnpService();
const MMS = new MoMoService();

// --- Ride Requests ---
export const matchingTrips = async (req: Request, res: Response) => {
  const { pickup, dropoff, departure, passengers } = req.body;
  const result = await MatchingService.findMatchingTrips({
    pickup,
    dropoff,
    departureDate: departure,
    passengerCount: passengers,
  });
  return res.json(success(result));
};

export const createRideRequest = async (req: Request, res: Response) => {
  const result = await Service.createBooking(
    req.user.id,
    req.body.tripId,
    req.body.booking
  );
  return res.json(created(result, "Booking"));
};

export const listRideBookings = async (req: Request, res: Response) => {
  const result = await Service.getBookingByRiderId(req.user.id);
  return res.json(success(result));
};

export const getRideRequestDetail = async (req: Request, res: Response) => {
  const requestId = req.params.id;
  // TODO: lấy chi tiết yêu cầu
  return res.json(success({ id: requestId, from: "A", to: "B" }));
};

export const cancelRideRequest = async (req: Request, res: Response) => {
  const requestId = req.params.id;
  // TODO: hủy yêu cầu đi xe
  return res.json(success({ message: `Ride request ${requestId} cancelled` }));
};

// --- Rides ---
export const listRides = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // TODO: lấy danh sách chuyến đi của rider
  return res.json(success([{ id: "ride1", driver: "John" }]));
};

export const getRideDetail = async (req: Request, res: Response) => {
  const rideId = req.params.id;
  // TODO: chi tiết 1 chuyến
  return res.json(success({ id: rideId, driver: "John", route: "A → B" }));
};

export const getCurrentStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // TODO: lấy trạng thái hiện tại của rider (đang chờ, đang đi,...)
  return res.json(success({ status: "waiting" }));
};

// --- Feedback ---
export const sendFeedback = async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const { rating, comment } = req.body;
  // TODO: lưu đánh giá chuyến đi
  return res.json(
    success({ message: "Feedback submitted", rideId, rating, comment })
  );
};

// Tạo payment URL cho booking
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { data, paymentMethod } = req.body;
    if (!data.bookingId || !paymentMethod)
      throw new AppError("Thiếu thông tin", 400);

    let paymentUrl = "";
    if (paymentMethod === "vnpay") {
      paymentUrl = await VNPS.createPayment(
        ETransactionType.RIDER,
        { bookingId: data.bookingId },
        req.ip as string
      );
    } else if (paymentMethod === "momo") {
      paymentUrl = await MMS.createPayment(ETransactionType.RIDER, {
        bookingId: data.bookingId,
      });
    } else {
      throw new AppError("Phương thức thanh toán không hợp lệ", 400);
    }
    if (!paymentUrl) throw new AppError("Không thể lấy được URL", 500);

    return res.json(success(paymentUrl));
  } catch (error) {
    console.error("Payment creation error:", error);
    return res.status(500).json(serverError("Payment creation error"));
  }
};

// Xử lý callback từ VNPay
export const vnpayReturn = async (req: Request, res: Response) => {
  try {
    const vnp_Params = req.query as VnpParams;
    const result = await VNPS.vnpayIPN(vnp_Params);
    if (result) {
      return res.status(200).json(success(result));
    }
    return res.status(400).json(badRequest("Invalid signature"));
  } catch (error) {
    return res.status(500).json(serverError("VNPay return error"));
  }
};

// Xử lý callback từ MoMo
export const momoReturn = async (req: Request, res: Response) => {
  try {
    const momoParams = req.query;
    const result = await MMS.momoIPN(momoParams);
    if (result) {
      return res.status(200).json(success(result));
    }
    return res.status(400).json(badRequest("Invalid signature"));
  } catch (error) {
    return res.status(500).json(serverError("MoMo return error"));
  }
};

// Xử lý IPN từ VNPay
export const vnpayIPN = async (req: Request, res: Response) => {
  try {
    const vnp_Params = req.body as VnpParams;
    const result = await VNPS.vnpayIPN(vnp_Params);
    // VNPay yêu cầu trả về đúng định dạng JSON với RspCode và Message
    return res.json(result);
  } catch (error) {
    return res.json({ RspCode: "99", Message: "Unknown error" });
  }
};

// Xử lý IPN từ MoMo
export const momoIPN = async (req: Request, res: Response) => {
  try {
    const momoParams = req.body;
    const result = await MMS.momoIPN(momoParams);
    // MoMo yêu cầu trả về JSON với message
    return res.json(result);
  } catch (error) {
    return res.json({ message: "Internal error" });
  }
};
