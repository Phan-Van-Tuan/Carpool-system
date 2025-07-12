import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./utils/configs/variable";
import logger from "./utils/configs/logger";
import getLocalIP from "./utils/configs/ip";
import { registerSocketHandlers } from "./sockets";

// 1. Tạo server HTTP từ app express
const httpServer = createServer(app);

// 2. Khởi tạo Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // Hoặc chỉ định domain cụ thể
  },
});

// 3. Setup socket handler riêng
registerSocketHandlers(io);

// 4. Start server
const ip = getLocalIP();
httpServer.listen(config.PORT, () => {
  console.log(
    "\n ---------------------------- EXPRESS SERVER -----------------------------"
  );
  logger.success(`🚀 Server running on http://${ip}:${config.PORT}`);
});
