import { Server, Socket } from "socket.io";
import { decodeToken } from "../../utils/security/jwt";
import { finishBooking } from "../other/other.service";

// Gắn thông tin user vào socket nếu xác thực thành công
function authenticateSocket(socket: Socket) {
  const token = socket.handshake.auth?.token;
  if (!token) throw new Error("No token provided");

  try {
    const decoded = decodeToken(token).payload;
    socket.data.user = decoded; // gắn userId hoặc role nếu cần
    console.log(`✅ Authenticated socket user: ${decoded.id}`);
  } catch (err) {
    console.log(err);
    throw new Error("Invalid token");
  }
}

export function onTripConnection(io: Server, socket: Socket) {
  try {
    authenticateSocket(socket);
  } catch (err) {
    console.error("❌ Socket auth failed:", err);
    socket.disconnect();
    return;
  }

  console.log("🔌 New trip socket connected:", socket.id);

  socket.on("trip:join", ({ tripId }) => {
    if (!tripId) return;
    socket.join(tripId);
    console.log(`🛣️ Socket ${socket.id} joined trip ${tripId}`);
  });

  socket.on("location:driver:update", (data) => {
    const { tripId, latitude, longitude, timestamp } = data;
    if (!tripId || !latitude || !longitude) return;

    // console.log(`📍 [${tripId}] Location from ${socket.id}:`, {
    //   latitude,
    //   longitude,
    //   timestamp,
    // });

    // Gửi cho các client khác trong phòng tripId
    socket.to(tripId).emit("share:location:driver", {
      socketId: socket.id,
      latitude,
      longitude,
      timestamp,
    });
  });

  socket.on("trip:status:update", async (data) => {
    const { tripId, status, bookingId, bookingIds } = data;
    if (!tripId || !status || !bookingId) return;

    console.log(`📍 [${status}] Location from ${socket.id}:`, {
      status,
      bookingId,
    });

    // Gửi cho các client khác trong phòng tripId
    socket.to(tripId).emit("booking:status:update", {
      socketId: socket.id,
      status,
      bookingId,
      timestamp: new Date().toISOString(),
    });

    if (status === "dropped") {
      try {
        const result = await finishBooking(bookingId);
        console.log("✅ Booking finished:", result._id);

        // Emit thêm sự kiện hoàn thành nếu muốn
        socket.to(tripId).emit("booking:finished", {
          bookingId: result._id,
          status: result.status,
        });
      } catch (err) {
        console.error("❌ Error finishing booking:", err);
      }
    }

    if (status === "ongoing") {
      try {console.log("✅ Trip start signal sent");
        io.emit("trip:started:signal", {
          bookingIds,
          tripId: bookingId,
          message: `Trip ${tripId} is starting`,
          timestamp: new Date().toISOString(),
        });
        
      } catch (err) {
        console.error("❌ Error sending trip start signal:", err);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
}
