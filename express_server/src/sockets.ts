import { Server } from "socket.io";
import { onTripConnection } from "./modules/sockets/trip.socket";
// import { onChatConnection } from "./chat.socket"; // nếu có nhiều module

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    // Đăng ký các handler cho module riêng
    onTripConnection(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}
