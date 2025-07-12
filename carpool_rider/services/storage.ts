import * as SecureStore from "expo-secure-store";

export enum KEYSTORE {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

const storage = {
  async set(key: KEYSTORE, value: string, option?: {}) {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  },
  async get(key: KEYSTORE) {
    return await SecureStore.getItemAsync(key);
  },
  async remove(key: KEYSTORE) {
    await SecureStore.deleteItemAsync(key);
  },
};

export const getAccessToken = async () => {
  return await storage.get(KEYSTORE.ACCESS_TOKEN);
};

export const getRefreshToken = async () => {
  return await storage.get(KEYSTORE.REFRESH_TOKEN);
};

export const setTokens = async (accessToken: string, refreshToken: string) => {
  await storage.set(KEYSTORE.ACCESS_TOKEN, accessToken);
  await storage.set(KEYSTORE.REFRESH_TOKEN, refreshToken);
};

export const clearTokens = async () => {
  await storage.remove(KEYSTORE.ACCESS_TOKEN);
  await storage.remove(KEYSTORE.REFRESH_TOKEN);
};

export default storage;
