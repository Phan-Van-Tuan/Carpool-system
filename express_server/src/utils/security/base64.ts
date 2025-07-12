export function encodeToBase64(data: any): string {
  try {
    const jsonString = JSON.stringify(data); // Chuyển object thành JSON string
    return Buffer.from(jsonString, "utf-8").toString("base64"); // Mã hóa thành Base64
  } catch (error) {
    console.error("Lỗi khi mã hóa Base64:", error);
    return "";
  }
}

export function decodeFromBase64(base64String: string): any {
  try {
    const jsonString = Buffer.from(base64String, "base64").toString("utf-8"); // Giải mã Base64
    return JSON.parse(jsonString); // Chuyển JSON string về object
  } catch (error) {
    console.error("Lỗi khi giải mã Base64:", error);
    return null;
  }
}
