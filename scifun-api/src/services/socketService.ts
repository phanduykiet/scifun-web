// src/services/socketService.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { socketConfig } from "../config/socketConfig";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware";
import Notification from "../models/Notification";

let io: SocketIOServer;

// ========== KHỞI TẠO SOCKET SERVER ==========
export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, socketConfig);

  // Middleware xác thực
  io.use(socketAuthMiddleware);

  // Lắng nghe connection
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    const role = socket.data.role;
    
    console.log(`User ${userId} (${role}) connected`);
    
    // Join rooms
    socket.join(userId); // Room riêng của user
    if (role === "ADMIN") {
      socket.join("admins"); // Room cho admin
    }

    // ========== EVENT HANDLERS ==========
    
    // 1. Đánh dấu notification đã đọc
    socket.on("notification:read", async (notificationId: string) => {
      try {
        await Notification.findOneAndUpdate(
          { _id: notificationId, userId },
          { isRead: true }
        );
        socket.emit("notification:updated", { notificationId });
      } catch (error) {
        console.error("Error marking notification as read:", error);
        socket.emit("error", { message: "Không thể cập nhật thông báo" });
      }
    });

    // 2. Đánh dấu tất cả đã đọc
    socket.on("notification:readAll", async () => {
      try {
        await Notification.updateMany(
          { userId, isRead: false },
          { isRead: true }
        );
        socket.emit("notification:allRead");
      } catch (error) {
        console.error("Error marking all as read:", error);
        socket.emit("error", { message: "Không thể cập nhật thông báo" });
      }
    });

    // 3. Fetch danh sách notifications
    socket.on("notification:fetch", async ({ page = 1, limit = 20 }) => {
      try {
        const skip = (page - 1) * limit;
        
        const [notifications, total, unreadCount] = await Promise.all([
          Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
          Notification.countDocuments({ userId }),
          Notification.countDocuments({ userId, isRead: false })
        ]);

        socket.emit("notification:list", {
          notifications,
          total,
          unreadCount,
          page,
          totalPages: Math.ceil(total / limit)
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        socket.emit("error", { message: "Không thể lấy thông báo" });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });

  console.log("Socket.IO initialized");
  return io;
};

// ========== HELPER FUNCTIONS ==========

// Gửi notification đến 1 user
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};

// Gửi notification đến tất cả admin
export const emitToAdmins = (event: string, data: any) => {
  if (io) {
    io.to("admins").emit(event, data);
  }
};

// Gửi đến phòng cụ thể 
export const emitToRoom = (room: string, event: string, data: any) => {
  if (io) io.to(room).emit(event, data);
};

// Gửi đến tất cả
export const emitToAll = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};

// Export io
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO chưa được khởi tạo");
  }
  return io;
};