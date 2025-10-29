import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { connectES } from "./config/elasticSearch";
import indexRoutes from "./routes/indexRoutes";
import { initSocket } from "./services/socketService";
import cors from "cors";  
import http from "http";

//Đọc file .env trong thư mục gốc, nạp các biến môi trường vào process.env.
dotenv.config();
//Khởi tạo ứng dụng Express, lưu vào biến app. Đây là đối tượng chính để gắn middleware, routes, và lắng nghe port.
const app = express();
const server = http.createServer(app);
//Middleware của Express, cho phép server hiểu dữ liệu JSON gửi lên từ client.
app.use(cors());
app.use(express.json());
//Mount tất cả các route trong authRoutes vào prefix /api.
app.use("/api/v1", indexRoutes);

const PORT = process.env.PORT || 5000;

connectDB();
connectES();
// Khởi tạo WebSocket
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server + WebSocket running on port ${PORT}`);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
});
