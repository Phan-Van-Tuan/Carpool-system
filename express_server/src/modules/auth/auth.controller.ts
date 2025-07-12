import { Request, Response } from "express";
import AuthService from "./auth.service";
import { AppError } from "../../utils/configs/appError";
import { created, success } from "../../utils/configs/res";

export const AuthController = {
  // ─── AUTH ──────────────────────────────
  register: async (req: Request, res: Response) => {
    const { otpToken, phone, password, firstName, lastName, email, role } =
      req.body;

    const ip = req.ip || "Unknown";
    const device = req.headers["user-agent"] || "Unknown";

    const result = await AuthService.register(
      otpToken,
      phone,
      password,
      firstName,
      lastName,
      email,
      role,
      ip,
      device
    );
    return res.status(201).json(created(result, "Account"));
  },

  login: async (req: Request, res: Response) => {
    const { phone, email, role, password } = req.body;
    const ip = req.ip || "Unknown";
    const device = req.headers["user-agent"] || "Unknown";

    const result = await AuthService.login(
      phone,
      email,
      role,
      password,
      ip,
      device
    );
    return res.status(200).json(success(result));
  },

  socialLogin: async (req: Request, res: Response) => {
    const { provider, idToken } = req.body;
    // TODO: Xác thực token từ Google/Apple, trả token người dùng
    return res.json({ success: true });
  },

  refreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("Missing refresh token", 401);
    const ip = req.ip || "Unknown";
    const device = req.headers["user-agent"] || "Unknown";

    const tokens = await AuthService.refreshTokenPair(refreshToken, ip, device);
    return res.json(success(tokens));
  },

  logout: async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) throw new AppError("Access token missing", 401);

    await AuthService.logout(accessToken, req.user.id);
    return res.status(200).json(success(true));
  },

  logoutAll: async (req: Request, res: Response) => {
    await AuthService.logoutAll(req.user.id);
    return res.json(success(true));
  },

  listDevices: async (req: Request, res: Response) => {
    const devices = await AuthService.listDevices(req.user.id);
    return res.json(success(devices));
  },

  // ─── Password ───────────────────────────────────────────
  forgotPassword: async (req: Request, res: Response) => {
    const { phone } = req.body;
    await AuthService.forgotPassword(phone);
    return res.json(success(true));
  },

  resetPassword: async (req: Request, res: Response) => {
    const { firebaseToken, newPassword, isLogoutAll } = req.body;
    await AuthService.resetPassword(firebaseToken, newPassword, isLogoutAll);
    return res.json(success(true));
  },

  changePassword: async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(req.user.id, currentPassword, newPassword);
    return res.json(success(true));
  },

  // ─── Thông tin cá nhân ────────────────────────────────
  getProfile: async (req: Request, res: Response) => {
    const profile = await AuthService.getProfile(req.user.id);
    return res.json(success(profile));
  },

  // ─── OTP ───────────────────────────────────────────────
  requestOtp: async (req: Request, res: Response) => {
    const { phone, purpose } = req.body;
    // TODO: Gửi OTP qua Firebase hoặc dịch vụ SMS
    return res.json({ success: true, message: `OTP sent for ${purpose}` });
  },

  verifyOtp: async (req: Request, res: Response) => {
    const { phone, code, purpose } = req.body;
    // TODO: Xác minh OTP, tạo mã tạm (otpToken)
    return res.json({ success: true, otpToken: "mockOtpToken" });
  },

  // ─── Email xác minh ───────────────────────────────────
  sendEmailVerify: async (req: Request, res: Response) => {
    // TODO: Gửi email xác minh
    return res.json({ success: true, message: "Verification email sent" });
  },

  verifyEmail: async (req: Request, res: Response) => {
    const { token } = req.body;
    // TODO: Xác minh token email
    return res.json({ success: true, message: "Email verified" });
  },

  // ─── Xác thực hai lớp (2FA) ────────────────────────────
  enable2FA: async (req: Request, res: Response) => {
    // TODO: Trả QR code và secret TOTP
    return res.json({ success: true, qr: "qrcode-link", secret: "ABC123" });
  },

  verify2FA: async (req: Request, res: Response) => {
    const { code } = req.body;
    // TODO: Kiểm tra mã TOTP, xác nhận bật 2FA
    return res.json({ success: true });
  },

  disable2FA: async (req: Request, res: Response) => {
    const { code } = req.body;
    // TODO: Kiểm tra và tắt 2FA
    return res.json({ success: true });
  },

  // ─── Admin ─────────────────────────────────────────────
  adminLogin: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const ip = req.ip || "Unknown";
    const device = req.headers["user-agent"] || "Unknown";

    const tokens = await AuthService.adminLogin(email, password, ip, device);
    return res.json(success(tokens));
  },

  adminLogout: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new AppError("Access token missing", 401);

    await AuthService.logout(token, req.user.id);
    res.json(success(true));
  },

  adminRefreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) throw new AppError("Missing refresh token", 401);

    const ip = req.ip || "Unknown";
    const device = req.headers["user-agent"] || "Unknown";

    const tokens = await AuthService.refreshTokenPair(refreshToken, ip, device);
    return res.json(success(tokens));
  },

  // ─── Nội bộ ────────────────────────────────────────────
  internalValidateToken: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new AppError("Token required", 401);

    const decoded = AuthService.internalValidateToken(token);
    res.json(success(decoded));
  },

  internalRevokeUser: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) throw new AppError("Missing user ID", 400);
    const result = AuthService.internalRevokeUser(userId);
    return res.json(success(result));
  },
};
