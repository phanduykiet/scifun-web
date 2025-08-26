import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";

//Đọc file .env trong thư mục gốc, nạp các biến môi trường vào process.env.
dotenv.config();
//Khởi tạo ứng dụng Express, lưu vào biến app. Đây là đối tượng chính để gắn middleware, routes, và lắng nghe port.
const app = express();
//Middleware của Express, cho phép server hiểu dữ liệu JSON gửi lên từ client.
app.use(express.json());
//Mount tất cả các route trong authRoutes vào prefix /api/auth.
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
});
