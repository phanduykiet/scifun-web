// src/services/socketService.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { socketConfig } from "../config/socketConfig";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware";

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
