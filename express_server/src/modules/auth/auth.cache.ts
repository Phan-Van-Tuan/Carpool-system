import config from "../../utils/configs/variable";
import redisClient from "../../utils/plugins/redis";

export const AuthCache = {
  /**
   * Lưu refreshToken session
   */
  async saveSession(accountId: string, tokenId: string, session: object) {
    const key = `Session:${accountId}:${tokenId}`;
    await redisClient.set(key, JSON.stringify(session), {
      EX: config.REFRESH_EXPIRE,
    });
  },

  /**
   * Lấy lại 1 phiên (tokenId)
   */
  async getSession(accountId: string, tokenId: string) {
    const key = `Session:${accountId}:${tokenId}`;
    const raw = await redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Lấy tất cả phiên của user
   */
  async listSessions(accountId: string) {
    const pattern = `Session:${accountId}:*`;
    const keys = await redisClient.keys(pattern);
    const sessions = [];

    for (const key of keys) {
      const tokenId = key.split(":")[2];
      const raw = await redisClient.get(key);
      if (raw) sessions.push({ tokenId, ...JSON.parse(raw) });
    }

    return sessions;
  },

  /**
   * Xóa 1 phiên (logout 1 thiết bị)
   */
  async deleteSession(accountId: string, tokenId: string) {
    const key = `Session:${accountId}:${tokenId}`;
    await redisClient.del(key);
  },

  /**
   * Xóa toàn bộ phiên (logout all)
   */
  async deleteAllSessions(accountId: string) {
    const pattern = `Session:${accountId}:*`;
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redisClient.del(key)));
    }
  },
  /**
   * Đưa accessToken vào blacklist
   */
  async blacklistAccessToken(token: string, ttlSeconds = config.ACCESS_EXPIRE) {
    await redisClient.setEx(`BlacklistToken:${token}`, ttlSeconds, "1");
  },

  /**
   * Kiểm tra accessToken có bị thu hồi không
   */
  async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    const result = await redisClient.exists(`BlacklistToken:${token}`);
    return result === 1;
  },
};
