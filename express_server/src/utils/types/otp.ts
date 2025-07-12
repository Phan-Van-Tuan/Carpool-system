export interface verifyOTP {
  email: string;
  otp: number;
}

export interface JwtData {
  payload: object;
  iat: number;
  exp: number;
}
