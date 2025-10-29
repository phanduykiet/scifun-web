// src/config/socketConfig.ts
import { ServerOptions } from "socket.io";

export const socketConfig: Partial<ServerOptions> = {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
  transports: ["websocket", "polling"] as const,
  pingTimeout: 60000,
  pingInterval: 25000,
};