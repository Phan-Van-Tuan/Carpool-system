import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import _Account, { AStatus, IAccount, Role } from "../../models/account.model";
import { AppError } from "../../utils/configs/appError";
import { firebaseAdmin } from "../../utils/plugins/firebase";
import config from "../../utils/configs/variable";
import { decodeToken, generateToken } from "../../utils/security/jwt";
import { IToken, Payload } from "../../utils/types/token";
import { AuthCache } from "./auth.cache";

const AuthService = {
  async register(
    firebaseToken: string,
    phone: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string | undefined,
    role: Role.RIDER | Role.DRIVER,
    ip: string,
    device: string
  ) {
    // 1. Xác minh Firebase OTP Token → Lấy SĐT
    // const { phone } = await verifyFirebaseToken(firebaseToken);

    // 2. Kiểm tra tồn tại
    const exists = await _Account.findOne({ phone, role });
    if (exists) throw new AppError("Phone number already registered", 400);

    if (email) {
      const emailExists = await _Account.findOne({ email });
      if (emailExists) throw new AppError("Email already registered", 400);
    }

    // 3. Tạo tài khoản
    const hashed = await bcrypt.hash(password, config.SALT);
    await _Account.create({
      phone,
      password: hashed,
      firstName,
      lastName,
      role,
      status: AStatus.ACTIVE,
      verified: { phone: true },
      email,
    });

    return true;
  },

  async login(
    phone: string,
    email: string,
    role: string,
    password: string,
    ip: string,
    device: string
  ) {
    const account = await _Account.findOne({
      phone,
      role,
    });

    if (!account) throw new AppError("Account not found", 400);

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) throw new AppError("Invalid password", 400);

    const tokenId = uuidv4();
    const payload = { id: account.id, role: account.role, tokenId };

    const accessToken = generateToken(payload, config.ACCESS_EXPIRE);
    const refreshToken = generateToken(payload, config.REFRESH_EXPIRE);

    await AuthCache.saveSession(account.id, tokenId, {
      ip,
      device,
      createdAt: new Date(),
    });

    return { accessToken, refreshToken, user: account };
  },

  async refreshTokenPair(oldRefreshToken: string, ip: string, device: string) {
    const decoded = decodeToken(oldRefreshToken) as IToken;
    const { id, role, tokenId: oldTokenId } = decoded.payload;

    const session = await AuthCache.getSession(id, oldTokenId);
    if (!session) throw new AppError("Refresh token expired or revoked", 401);

    // Xoá phiên cũ
    await AuthCache.deleteSession(id, oldTokenId);

    // Sinh phiên mới
    const newTokenId = uuidv4();
    const newAccessToken = generateToken(
      { id, role, tokenId: newTokenId },
      config.ACCESS_EXPIRE
    );
    const newRefreshToken = generateToken(
      { id, role, tokenId: newTokenId },
      config.REFRESH_EXPIRE
    );

    await AuthCache.saveSession(id, newTokenId, {
      ip,
      device,
      createdAt: new Date(),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logout(accessToken: string, userId: string) {
    const decoded = decodeToken(accessToken) as IToken;

    const tokenId = decoded.payload.tokenId;
    if (!tokenId) throw new AppError("Invalid token format", 400);

    // Xoá session & chặn token
    await AuthCache.deleteSession(userId, tokenId);
    await AuthCache.blacklistAccessToken(accessToken);

    return true;
  },

  async logoutAll(userId: string) {
    await AuthCache.deleteAllSessions(userId);
    return true;
  },

  async listDevices(userId: string) {
    const sessions = await AuthCache.listSessions(userId);
    return sessions;
  },

  async forgotPassword(phone: string) {
    const account = await _Account.findOne({ phone });
    if (!account) throw new AppError("Phone number not registered", 404);

    // TODO: Gửi OTP qua Firebase (ở phía client)
    // Backend không cần làm gì thêm nếu dùng Firebase OTP

    return true;
  },

  async resetPassword(
    firebaseToken: string,
    newPassword: string,
    isLogoutAll: boolean = false
  ) {
    const { phone } = await verifyFirebaseToken(firebaseToken);

    const account = await _Account.findOne({ phone });
    if (!account) throw new AppError("Account not found", 404);

    const hashed = await bcrypt.hash(newPassword, config.SALT);
    account.password = hashed;
    await account.save();

    if (isLogoutAll) {
      // Optional: Xoá toàn bộ phiên cũ
      await AuthCache.deleteAllSessions(account.id);
    }
    return true;
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    isLogoutAll: boolean = false
  ) {
    const account = await _Account.findById(userId);
    if (!account) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) throw new AppError("Current password incorrect", 400);

    const hashed = await bcrypt.hash(newPassword, config.SALT);
    account.password = hashed;
    await account.save();

    if (isLogoutAll) {
      // Optional: Xoá toàn bộ phiên cũ
      await AuthCache.deleteAllSessions(account.id);
    }

    return true;
  },

  async getProfile(userId: string) {
    const account = await _Account.findById(userId).lean();

    if (!account) throw new AppError("Account not found", 404);

    // Loại bỏ các field nhạy cảm
    const { password, __v, ...safeProfile } = account;
    return safeProfile;
  },

  async adminLogin(
    email: string,
    password: string,
    ip: string,
    device: string
  ) {
    const admin = await _Account.findOne({
      email,
      role: { $in: [Role.ADMIN, Role.OWNER] },
    });
    if (!admin) throw new AppError("Admin not found", 404);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new AppError("Invalid credentials", 400);

    const tokenId = uuidv4();
    const payload = { id: admin.id, role: admin.role };

    const accessToken = generateToken(
      { ...payload, tokenId },
      config.ACCESS_EXPIRE
    );
    const refreshToken = generateToken(
      { ...payload, tokenId },
      config.REFRESH_EXPIRE
    );

    await AuthCache.saveSession(admin.id, tokenId, {
      ip,
      device,
      createdAt: new Date(),
    });

    return { accessToken, refreshToken };
  },

  async internalValidateToken(token: string) {
    return decodeToken(token) as IToken;
  },

  async internalRevokeUser(userId: string) {
    return await AuthCache.deleteAllSessions(userId);
  },
};

export default AuthService;

async function verifyFirebaseToken(idToken: string) {
  try {
    if (config.ENV === "development" && idToken == "development") {
      return {
        uid: "123456",
        phone: "0981234565",
      };
    }
    console.log(config.ENV, idToken);

    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    if (!decoded.phone_number) {
      throw new AppError("Phone number missing in token", 400);
    }
    return {
      uid: decoded.uid,
      phone: decoded.phone_number,
    };
  } catch (err) {
    throw new AppError("Invalid Firebase token", 400);
  }
}
