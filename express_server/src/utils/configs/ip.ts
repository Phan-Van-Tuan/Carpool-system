import os from "os";
import { AppError } from "./appError";

function getLocalIP(): string {
  const interfaces = os.networkInterfaces();

  const netInterface = interfaces["Wi-Fi"]; // Có thể là undefined

  if (!netInterface) throw new AppError("Không tìm thấy Wi-fi!", 500);

  for (const net of netInterface) {
    if (net.family === "IPv4" && !net.internal) {
      return net.address;
    }
  }

  throw new AppError("Không tìm thấy IP mạng nội bộ!", 500);
}

export default getLocalIP;
