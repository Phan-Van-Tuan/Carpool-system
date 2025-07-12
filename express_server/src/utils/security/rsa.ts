import crypto from "crypto";

// Tạo cặp khóa RSA
export function generateRSAKeys(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // Độ dài khóa
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  return { publicKey, privateKey };
}

// Mã hóa khóa AES bằng RSA
export function encryptRSAKey(aesKey: Buffer, publicKey: string): string {
  return crypto.publicEncrypt(publicKey, aesKey).toString("base64");
}

// Giải mã khóa AES bằng RSA
export function decryptRSAKey(
  encryptedKey: string,
  privateKey: string
): string {
  return crypto
    .privateDecrypt(privateKey, Buffer.from(encryptedKey, "base64"))
    .toString();
}

export function generateKey(password: string): Buffer {
  return crypto.createHash("sha256").update(password).digest();
}
