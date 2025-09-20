import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import indexRoutes from "./routes/indexRoutes";
import cors from "cors";


//Đọc file .env trong thư mục gốc, nạp các biến môi trường vào process.env.
dotenv.config();
console.log("Loaded REACT_URL:", process.env.REACT_URL);

//Khởi tạo ứng dụng Express, lưu vào biến app. Đây là đối tượng chính để gắn middleware, routes, và lắng nghe port.
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: process.env.REACT_URL || "http://localhost:5173", // cho FE gọi
    credentials: true, // nếu cần cookie / Authorization header
  })
);


//Middleware của Express, cho phép server hiểu dữ liệu JSON gửi lên từ client.
app.use(express.json());
//Mount tất cả các route trong authRoutes vào prefix /api.
app.use("/api/v1", indexRoutes);



connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
});
