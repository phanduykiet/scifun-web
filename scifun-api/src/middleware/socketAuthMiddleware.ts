// src/middleware/socketAuthMiddleware.ts
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Token không được cung cấp"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Gắn thông tin user vào socket
    socket.data.userId = decoded.userId;
    socket.data.email = decoded.email;
    socket.data.role = decoded.role;
    
    next();
  } catch (error) {
    next(new Error("Token không hợp lệ"));
  }
};