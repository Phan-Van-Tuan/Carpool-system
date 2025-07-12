export enum EPayType {
  RIDER = "rider_pay_for_trip",
  REFUND = "refund_for_trip",
  RECHARGE = "driver_recharge",
  WITHDRAW = "driver_withdraw",
  REWARD = "driver_reward",
  FEE = "collect_fee_by_driver",
  LIQUIDITY = "liquidity_for_trip",
  ORTHER = "other",
}

export enum EPayStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAIL = "fail",
}

export enum EPayMethod {
  VNPAY = "vnpay",
  MOMO = "momo",
  CASH = "cash",
}
