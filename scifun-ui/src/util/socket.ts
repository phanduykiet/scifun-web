// src/util/socket.ts
import { io } from "socket.io-client";

// URL backend của bạn
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Lấy token người dùng (ví dụ lưu ở localStorage)
const token = localStorage.getItem("token");

// Kết nối socket
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  auth: { token }, // gửi token để socketAuthMiddleware xác thực
});

// Khi kết nối thành công
socket.on("connect", () => {
  console.log("✅ Kết nối socket thành công:", socket.id);
});

// Khi mất kết nối
socket.on("disconnect", () => {
  console.log("❌ Mất kết nối socket");
});

// Khi gặp lỗi
socket.on("error", (err) => {
  console.error("⚠️ Lỗi từ socket:", err);
});
