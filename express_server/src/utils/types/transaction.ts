export interface VnpParams {
  [key: string]: string;
}

export interface MomoData {
  [key: string]: string;
}

export interface Bill {
  bookingId?: string;
  deposite: number; // tổng số tiền khách hàng phải trả
  tax: number; // tổng thuế
  fee: number; // tổng phí
  withdraw: number; // số tiền tài xế nhận được
}
