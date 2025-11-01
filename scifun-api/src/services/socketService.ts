// src/services/socketService.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { socketConfig } from "../config/socketConfig";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware";
import { createComment } from "./commentService";

let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, socketConfig);
  io.use(socketAuthMiddleware);

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    const role = socket.data.role;

    console.log(`User ${userId} (${role}) connected`);
    socket.join(userId);
    if (role === "ADMIN") socket.join("admins");

    socket.on("comment:new", async ({ content, parentId }) => {
      try {
        // Gọi service để lưu DB + gửi realtime + thông báo reply
        await createComment(userId, content, parentId);
      } catch (err: any) {
        console.error("Lỗi khi tạo bình luận:", err.message);
        socket.emit("error", { message: "Không thể gửi bình luận" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  console.log("Socket.IO initialized");
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO chưa được khởi tạo");
  return io;
};

// Gửi thông báo đổi hạng tới 1 user
export const emitRankChangeToUser = (userId: string, data: {
  subjectId: string;
  subjectName: string;
  period: "daily" | "weekly" | "monthly" | "alltime";
  oldRank: number;
  newRank: number;
  change: "up" | "down";
}) => {
  if (!io) return;
  io.to(userId).emit("leaderboard:rankChanged", data);
};

// Gửi bình luận mới cho tất cả
export const emitNewComment = (comment: any) => {
  if (!io) return;
  io.emit("comment:new", comment);
};

// Gửi realtime phản hồi bình luận đến người bị reply
export const emitReplyToUser = (userId: string, data: any) => {
  if (!io) return;
  io.to(userId).emit("comment:reply", data);
};
