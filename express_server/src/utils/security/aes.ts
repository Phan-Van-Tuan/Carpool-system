import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // Độ dài của IV

export function encryptAES(
  data: string,
  key: Buffer
): { encryptedData: string; iv: string } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
  };
}

export function decryptAES(
  encryptedData: string,
  key: Buffer,
  iv: string
): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function generateKey(password: string): Buffer {
  return crypto.createHash("sha256").update(password).digest();
}
