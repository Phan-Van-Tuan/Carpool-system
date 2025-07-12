import crypto from "crypto";
import { URLSearchParams } from "url";
import config from "../../utils/configs/variable";
import { MomoData, VnpParams } from "../../utils/types/transaction";
import { AppError } from "../../utils/configs/appError";
import Booking, { EBookingStatus } from "../../models/booking.model";
import _Transaction, {
  ETransactionMethod,
  ETranferStatus,
  ETransactionType,
  ITransaction,
} from "../../models/transaction.model";
import { decodeFromBase64, encodeToBase64 } from "../../utils/security/base64";

export class PaymentService {
  async getMyPayment(customerId: string) {
    try {
      const data = await _Transaction.find({ customerId });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const data = await _Transaction.find();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export class VnpService {
  async createPayment(paymentType: string, data: any, ip: string) {
    try {
      const booking = await Booking.findById(data.bookingId).exec();
      if (!booking) throw new AppError("Booking is not exist!", 400);
      if (booking.paymentStatus === ETranferStatus.SUCCESS)
        throw new AppError("Booking has been paid", 400);

      const amount = `${Math.round(booking.price * 100)}`;
      const info = encodeToBase64({ paymentType, data });
      const orderId = `${Date.now()}`;

      const vnp_Params: VnpParams = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: config.VNP_TMNCODE,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: info,
        vnp_OrderType: "other",
        vnp_Amount: amount,
        vnp_ReturnUrl: config.VNP_RETURN_URL, // Client sẽ redirect về đây
        vnp_IpAddr: ip || "",
        vnp_CreateDate: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "")
          .replace(/-/g, "")
          .replace(/:/g, "")
          .replace(/ /g, ""),
      };

      const sortedParams: VnpParams = Object.keys(vnp_Params)
        .sort()
        .reduce((r: VnpParams, k: string) => {
          r[k] = vnp_Params[k];
          return r;
        }, {});

      const signData = new URLSearchParams(sortedParams).toString();
      const hmac = crypto.createHmac("sha512", config.VNP_HASHSECRET);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      const paymentUrl = `${config.VNP_URL}?${new URLSearchParams(
        sortedParams
      ).toString()}&vnp_SecureHash=${signed}`;

      console.log("Payment url:", paymentUrl);
      return paymentUrl;
    } catch (error) {
      throw error;
    }
  }

  // IPN Handler - VNPay sẽ gọi endpoint này
  async vnpayIPN(vnp_Params: VnpParams): Promise<any> {
    try {
      console.log("VNPay IPN received:", vnp_Params);

      // Verify signature
      const secureHash = vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      const sortedParams: VnpParams = Object.keys(vnp_Params)
        .sort()
        .reduce((r: VnpParams, k: string) => {
          r[k] = vnp_Params[k];
          return r;
        }, {});

      const signData = new URLSearchParams(sortedParams).toString();
      const hmac = crypto.createHmac("sha512", config.VNP_HASHSECRET);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      if (secureHash !== signed) {
        console.error("Invalid signature in IPN");
        return { RspCode: "97", Message: "Checksum failed" };
      }

      const orderId = vnp_Params.vnp_TxnRef;
      const rspCode = vnp_Params.vnp_ResponseCode;
      const amount = parseInt(vnp_Params.vnp_Amount) / 100;

      // Kiểm tra order tồn tại
      const { paymentType, data } = decodeFromBase64(vnp_Params.vnp_OrderInfo);
      const booking = await Booking.findById(data.bookingId).exec();

      if (!booking) {
        return { RspCode: "01", Message: "Order not found" };
      }

      // Kiểm tra amount
      if (Math.abs(booking.price - amount) > 1) {
        // Allow small difference
        return { RspCode: "04", Message: "Amount invalid" };
      }

      // Kiểm tra transaction đã được xử lý chưa
      const existingTransaction = await _Transaction
        .findOne({
          transactionId: orderId,
        })
        .exec();

      if (existingTransaction) {
        return {
          RspCode: "02",
          Message: "This order has been updated to the payment status",
        };
      }

      // Xử lý kết quả thanh toán
      if (rspCode === "00") {
        // Thanh toán thành công
        booking.paymentStatus = ETranferStatus.SUCCESS;
        if (booking.status === EBookingStatus.ENDING)
          booking.status = EBookingStatus.FINISHED;
        await booking.save();

        const payment = await _Transaction.create({
          bookingId: booking._id,
          customerId: booking.customerId,
          amount: booking.price,
          method: ETransactionMethod.VNPAY,
          type: ETransactionType.RIDER,
          transactionId: orderId,
          transactionInfo: JSON.stringify(vnp_Params),
          status: ETranferStatus.SUCCESS,
        });
        await payment.save();

        console.log("Payment success processed:", payment._id);
        return { RspCode: "00", Message: "Success" };
      } else {
        // Thanh toán thất bại
        booking.paymentStatus = ETranferStatus.FAILED;
        await booking.save();

        const payment = await _Transaction.create({
          bookingId: booking._id,
          customerId: booking.customerId,
          amount: booking.price,
          method: ETransactionMethod.VNPAY,
          type: ETransactionType.RIDER,
          transactionId: orderId,
          transactionInfo: JSON.stringify(vnp_Params),
          status: ETranferStatus.FAILED,
        });
        await payment.save();

        console.log("Payment failed processed:", payment._id);
        return { RspCode: "00", Message: "Success" };
      }
    } catch (error) {
      console.error("Error in VNPay IPN:", error);
      return { RspCode: "99", Message: "Unknown error" };
    }
  }

  // Return URL Handler - Client redirect về đây
  async vnpayReturn(vnp_Params: VnpParams): Promise<any> {
    try {
      console.log("VNPay Return received:", vnp_Params);

      // Verify signature (same as IPN)
      const secureHash = vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      const sortedParams: VnpParams = Object.keys(vnp_Params)
        .sort()
        .reduce((r: VnpParams, k: string) => {
          r[k] = vnp_Params[k];
          return r;
        }, {});

      const signData = new URLSearchParams(sortedParams).toString();
      const hmac = crypto.createHmac("sha512", config.VNP_HASHSECRET);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      if (secureHash !== signed) {
        throw new AppError("Invalid payment signature", 400);
      }

      const rspCode = vnp_Params.vnp_ResponseCode;
      const orderId = vnp_Params.vnp_TxnRef;

      // Chỉ return thông tin cho client, không xử lý logic nghiệp vụ
      // Vì logic đã được xử lý trong IPN
      return {
        success: rspCode === "00",
        responseCode: rspCode,
        orderId: orderId,
        message:
          rspCode === "00" ? "Thanh toán thành công" : "Thanh toán thất bại",
      };
    } catch (error) {
      console.error("Error in VNPay Return:", error);
      throw error;
    }
  }

  // Query payment status
  async queryPayment(
    orderId: string,
    transDate: string,
    ip: string
  ): Promise<any> {
    try {
      const date = new Date();
      const vnp_RequestId = date.getTime().toString().slice(-6);
      const vnp_Version = "2.1.0";
      const vnp_Command = "querydr";
      const vnp_TmnCode = config.VNP_TMNCODE;
      const vnp_TxnRef = orderId;
      const vnp_OrderInfo = `Truy van GD ma: ${orderId}`;
      const vnp_TransactionDate = transDate;
      const vnp_CreateDate = date
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")
        .replace(/-/g, "")
        .replace(/:/g, "")
        .replace(/ /g, "");
      const vnp_IpAddr = ip;

      const data = [
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        vnp_TmnCode,
        vnp_TxnRef,
        vnp_TransactionDate,
        vnp_CreateDate,
        vnp_IpAddr,
        vnp_OrderInfo,
      ].join("|");

      const hmac = crypto.createHmac("sha512", config.VNP_HASHSECRET);
      const vnp_SecureHash = hmac
        .update(Buffer.from(data, "utf-8"))
        .digest("hex");

      const queryData = {
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        vnp_TmnCode,
        vnp_TxnRef,
        vnp_OrderInfo,
        vnp_TransactionDate,
        vnp_CreateDate,
        vnp_IpAddr,
        vnp_SecureHash,
      };

      // Call VNPay API để query
      const response = await fetch(config.VNP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryData),
      });

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export class MoMoService {
  async createPayment(paymentType: string, data: any) {
    try {
      const booking = await Booking.findById(data.bookingId).exec();
      if (!booking) throw new AppError("Booking is not exist!", 400);
      if (booking.paymentStatus === ETranferStatus.SUCCESS)
        throw new AppError("Booking has been paid", 400);

      const orderId = `${Date.now()}`;
      const requestData: MomoData = {
        accessKey: config.MOMO_ACCESS_KEY,
        amount: `${booking.price}`,
        extraData: encodeToBase64({ paymentType, data }),
        ipnUrl: config.MOMO_IPN_URL, // Backend IPN
        orderId: orderId,
        orderInfo: `Thanh toán cho chuyến xe: ${booking.customerId}`,
        partnerCode: config.MOMO_PARTNER_CODE,
        redirectUrl: config.MOMO_RETURN_URL, // Client return
        requestId: `${booking._id}`,
        requestType: "captureWallet",
      };

      const signData =
        `accessKey=${requestData.accessKey}&` +
        `amount=${requestData.amount}&` +
        `extraData=${requestData.extraData}&` +
        `ipnUrl=${requestData.ipnUrl}&` +
        `orderId=${requestData.orderId}&` +
        `orderInfo=${requestData.orderInfo}&` +
        `partnerCode=${requestData.partnerCode}&` +
        `redirectUrl=${requestData.redirectUrl}&` +
        `requestId=${requestData.requestId}&` +
        `requestType=${requestData.requestType}`;

      const signature = crypto
        .createHmac("sha256", config.MOMO_SECRET_KEY)
        .update(signData)
        .digest("hex");

      const paymentUrl = await this.sendPaymentRequest({
        ...requestData,
        signature,
        lang: "vi",
      });

      return paymentUrl;
    } catch (e) {
      throw e;
    }
  }

  // IPN Handler - MoMo gọi endpoint này
  async momoIPN(momo_Params: any): Promise<any> {
    try {
      console.log("MoMo IPN received:", momo_Params);

      // Verify signature
      const signData =
        `accessKey=${config.MOMO_ACCESS_KEY}` +
        `&amount=${momo_Params.amount}` +
        `&extraData=${momo_Params.extraData}` +
        `&message=${momo_Params.message}` +
        `&orderId=${momo_Params.orderId}` +
        `&orderInfo=${momo_Params.orderInfo}` +
        `&orderType=${momo_Params.orderType}` +
        `&partnerCode=${momo_Params.partnerCode}` +
        `&payType=${momo_Params.payType}` +
        `&requestId=${momo_Params.requestId}` +
        `&responseTime=${momo_Params.responseTime}` +
        `&resultCode=${momo_Params.resultCode}` +
        `&transId=${momo_Params.transId}`;

      const signature = crypto
        .createHmac("sha256", config.MOMO_SECRET_KEY)
        .update(signData)
        .digest("hex");

      if (signature !== momo_Params.signature) {
        console.error("Invalid signature in MoMo IPN");
        return { message: "Invalid signature" };
      }

      // Kiểm tra transaction đã xử lý chưa
      const existingTransaction = await _Transaction
        .findOne({
          transactionId: momo_Params.orderId,
        })
        .exec();

      if (existingTransaction) {
        return { message: "Transaction already processed" };
      }

      const { paymentType, data } = decodeFromBase64(momo_Params.extraData);
      const booking = await Booking.findById(data.bookingId).exec();

      if (!booking) {
        return { message: "Booking not found" };
      }

      if (Number(momo_Params.resultCode) === 0) {
        // Thanh toán thành công
        booking.paymentStatus = ETranferStatus.SUCCESS;
        if (booking.status === EBookingStatus.ENDING)
          booking.status = EBookingStatus.FINISHED;
        await booking.save();

        const payment = await _Transaction.create({
          bookingId: booking._id,
          customerId: booking.customerId,
          amount: booking.price,
          method: ETransactionMethod.MOMO,
          type: ETransactionType.RIDER,
          transactionId: momo_Params.orderId,
          transactionInfo: JSON.stringify(momo_Params),
          status: ETranferStatus.SUCCESS,
        });
        await payment.save();

        console.log("MoMo payment success:", payment._id);
      } else {
        // Thanh toán thất bại
        booking.paymentStatus = ETranferStatus.FAILED;
        await booking.save();

        const payment = await _Transaction.create({
          bookingId: booking._id,
          customerId: booking.customerId,
          amount: booking.price,
          method: ETransactionMethod.MOMO,
          type: ETransactionType.RIDER,
          transactionId: momo_Params.orderId,
          transactionInfo: JSON.stringify(momo_Params),
          status: ETranferStatus.FAILED,
        });
        await payment.save();

        console.log("MoMo payment failed:", payment._id);
      }

      return { message: "Success" };
    } catch (error) {
      console.error("Error in MoMo IPN:", error);
      return { message: "Internal error" };
    }
  }

  // Return URL Handler - Client redirect về đây
  async momoReturn(momo_Params: any): Promise<any> {
    try {
      console.log("MoMo Return received:", momo_Params);

      // Chỉ return kết quả cho client, không xử lý logic
      const resultCode = Number(momo_Params.resultCode);

      return {
        success: resultCode === 0,
        resultCode: resultCode,
        orderId: momo_Params.orderId,
        message:
          resultCode === 0 ? "Thanh toán thành công" : "Thanh toán thất bại",
      };
    } catch (error) {
      console.error("Error in MoMo Return:", error);
      throw error;
    }
  }

  async sendPaymentRequest(requestBody: any) {
    try {
      const response = await fetch(config.MOMO_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      return data.payUrl;
    } catch (error) {
      throw error;
    }
  }
}

// Refund function
export const refundPayment = async (
  paymentId: string,
  amount: number,
  ip: string,
  content: string
): Promise<any> => {
  try {
    const payment = await _Transaction.findById(paymentId);
    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (payment.method === ETransactionMethod.VNPAY) {
      return await processVNPayRefund(payment, amount, ip, content);
    } else if (payment.method === ETransactionMethod.MOMO) {
      return await processMoMoRefund(payment, amount, ip, content);
    }

    throw new Error("Unsupported payment method for refund");
  } catch (error) {
    console.error("Error processing refund:", error);
    throw error;
  }
};

const processVNPayRefund = async (
  payment: ITransaction,
  amount: number,
  ip: string,
  content: string
): Promise<any> => {
  try {
    const date = new Date();
    if (!payment.transactionInfo) {
      throw new Error("Transaction info is missing");
    }
    const transactionInfo = JSON.parse(payment.transactionInfo);

    const vnp_RequestId = date.getTime().toString().slice(-6);
    const vnp_Version = "2.1.0";
    const vnp_Command = "refund";
    const vnp_TmnCode = config.VNP_TMNCODE;
    const vnp_TransactionType = "03";
    const vnp_TxnRef = transactionInfo.vnp_TxnRef;
    const vnp_Amount = Math.round(amount * 100);
    const vnp_TransactionNo = "0";
    const vnp_TransactionDate =
      transactionInfo.vnp_PayDate || transactionInfo.vnp_CreateDate;
    const vnp_CreateBy = payment.customerId;
    const vnp_CreateDate = date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/ /g, "");
    const vnp_IpAddr = ip;
    const vnp_OrderInfo = content || `Hoan tien GD ma: ${vnp_TxnRef}`;

    const data = [
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_OrderInfo,
    ].join("|");

    const hmac = crypto.createHmac("sha512", config.VNP_HASHSECRET);
    const vnp_SecureHash = hmac
      .update(Buffer.from(data, "utf-8"))
      .digest("hex");

    const refundData = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_CreateBy,
      vnp_OrderInfo,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_SecureHash,
    };

    const response = await fetch(config.VNP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refundData),
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const processMoMoRefund = async (
  payment: ITransaction,
  amount: number,
  ip: string,
  content: string
): Promise<any> => {
  // MoMo refund implementation
  // This would require MoMo's refund API
  throw new Error("MoMo refund not implemented yet");
};
