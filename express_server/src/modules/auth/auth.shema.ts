import { z } from "zod";

export const AuthSchemas = {
  // 1. OTP
  otpRequest: z.object({
    phone: z.string().min(8, "Phone is required"),
    purpose: z.enum(["register", "login", "recovery"]),
  }),

  otpVerify: z.object({
    phone: z.string().min(8),
    code: z.string().length(6),
    purpose: z.enum(["register", "login", "recovery"]),
  }),

  // 2. Register
  register: z.object({
    otpToken: z.string().min(10),
    password: z.string().min(6),
    firstName: z.string().min(3).optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string(),
    role: z.string(),
  }),

  // 3. Login
  login: z.object({
    phone: z.string().min(8),
    password: z.string().min(6),
    role: z.enum(["rider", "driver", "admin"]),
  }),

  // 4. Social login
  socialLogin: z.object({
    provider: z.enum(["google", "apple"]),
    idToken: z.string(),
  }),

  // 5. Forgot password
  forgotPassword: z.object({
    phone: z.string().min(8),
  }),

  resetPassword: z.object({
    phone: z.string().min(8),
    code: z.string().length(6),
    newPassword: z.string().min(6),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),

  // 6. Email verify
  verifyEmail: z.object({
    token: z.string(),
  }),

  // 7. 2FA
  verify2FA: z.object({
    code: z.string().min(6).max(6),
  }),

  // 8. Admin login
  adminLogin: z.object({
    email: z.string().min(4),
    password: z.string().min(6),
  }),
};
