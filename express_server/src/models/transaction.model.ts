import mongoose, { Document, Schema } from "mongoose";

export enum ETransactionMethod {
  VNPAY = "vnpay",
  MOMO = "momo",
  CASH = "cash",
}

export enum ETranferStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "fail",
}

export enum ETransactionType {
  RIDER = "rider_pay_for_trip",
  REFUND = "refund_for_trip",
  RECHARGE = "driver_recharge",
  WITHDRAW = "driver_withdraw",
  REWARD = "driver_reward",
  FEE = "collect_fee_by_driver",
  LIQUIDITY = "liquidity_for_trip",
  ORTHER = "other",
}

export interface ITransaction extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  amount: number;
  method: ETransactionMethod;
  type: ETransactionType;
  note?: string;
  transactionId?: string;
  transactionInfo?: string;
}

const TransactionSchema: Schema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    type: { type: String, require: true },
    note: { type: String },
    transactionId: { type: String },
    transactionInfo: { type: String },
  },
  { timestamps: true }
);

const _Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
export default _Transaction;
