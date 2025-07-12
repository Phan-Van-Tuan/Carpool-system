import dotenv from "dotenv";
import getLocalIP from "./ip";

dotenv.config();
const ip = getLocalIP();
const port = process.env.PORT;

const config = {
  // Server
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV || "development",

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,

  // Database
  SALT: process.env.SALT || 10,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/express_db",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET_KEY || "your_jwt_secret_key",
  ACCESS_EXPIRE: (process.env.ACCESS_EXPIRE || 60 * 60 * 24) as number,
  REFRESH_EXPIRE: (process.env.REFRESH_EXPIRE || 60 * 60 * 24 * 30) as number,

  //
  SIGN_SECRET:
    process.env.DIGITAL_SIGNATURE_SECRET_KEY || "digital_signature_secret_key",

  // Twilio
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  MOMO_PARTNER_CODE: "MOMO",
  MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY || "",
  MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY || "",
  MOMO_ENDPOINT: "https://test-payment.momo.vn/v2/gateway/api/create",
  // MOMO_RETURN_URL: `express_user://callback`,
  MOMO_RETURN_URL: `http://${ip}:${port}/api/rider/payment/momo-return`,
  MOMO_IPN_URL: `carpool_rider://trips/payment`,
  // vnpay
  VNP_TMNCODE: process.env.VNP_TMNCODE || "",
  VNP_HASHSECRET: process.env.VNP_HASHSECRET || "",
  VNP_URL: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  VNP_API: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  VNP_RETURN_URL: `http://${ip}:${port}/api/rider/payment/vnpay-return`,
  VNP_IPN_URL: `http://${ip}:${port}/api/rider/payment/vnpay-ipn`,

  GOONG_API_KEY: process.env.GOONG_API_KEY,
};

export default config;
