# 📚 SCIFUN - HỆ THỐNG HỌC TẬP TRẮC NGHIỆM KHOA HỌC TỰ NHIÊN

## 🚀 Mô tả dự án

SciFun là nền tảng học tập trực tuyến chuyên về kiến thức khoa học tự nhiên thông qua hình thức trắc nghiệm tương tác. Hệ thống cung cấp kho bài tập phong phú, theo dõi tiến độ học tập realtime, hỗ trợ thông báo qua WebSocket và Email, tìm kiếm nhanh chóng với Elasticsearch. Dành cho học sinh, sinh viên và giáo viên với giao diện thân thiện, responsive trên mọi thiết bị.

---

## 📱 Giao diện ứng dụng

### Trang chủ
![Homepage](./docs/images/homepage.png)

### Dashboard học sinh
![Student Dashboard](./docs/images/student-dashboard.png)

### Trang làm quiz
![Quiz Page](./docs/images/quiz-page.png)

### Thống kê tiến độ
![Progress Stats](./docs/images/progress-stats.png)

### Thông báo realtime
![Notifications](./docs/images/notifications.png)

### Admin Dashboard
![Admin Dashboard](./docs/images/admin-dashboard.png)

---

## 👤 Chức năng Người Dùng (Học Sinh)

- **Đăng ký / Đăng nhập:** Xác thực qua OTP email
- **Xem danh sách môn học:** Vật lý, Hóa học, Sinh học, Toán học
- **Xem chi tiết môn học:** Danh sách chủ đề, tiến độ học tập
- **Xem danh sách chủ đề:** Theo từng môn học
- **Xem video bài giảng:** Video minh họa cho mỗi chủ đề
- **Làm bài trắc nghiệm:** 
  - Có giới hạn thời gian
  - Xem giải thích đáp án sau khi làm xong
  - Lưu lịch sử làm bài
- **Xem điểm số và kết quả:** 
  - Best score, average score
  - Số lần làm bài
  - Lịch sử chi tiết
- **Tìm kiếm:** Quiz, chủ đề với Elasticsearch
- **Thông báo realtime:**
  - Quiz mới được thêm
  - Hoàn thành quiz
  - Hoàn thành 100% chủ đề
  - Hoàn thành 100% môn học
  - Thay đổi xếp hạng
  - Nhắc nhở học tập
  - Báo cáo tuần
- **Thống kê tiến độ:**
  - % hoàn thành theo môn học
  - % hoàn thành theo chủ đề
  - Biểu đồ điểm số
  - Lịch sử làm bài
- **Cập nhật thông tin cá nhân:** 
  - Upload avatar lên Cloudinary
  - Cập nhật tên, ngày sinh, giới tính
- **Đổi mật khẩu**
- **Quên mật khẩu:** Gửi link reset qua email

---

## 🛠️ Chức năng Admin

- **Quản lý người dùng:**
  - Xem danh sách user
  - Tạo tài khoản mới
  - Xóa, chặn user
  - Phân quyền USER/ADMIN
- **Quản lý môn học (Subject):**
  - Thêm, sửa, xóa môn học
  - Upload hình ảnh môn học lên Cloudinary
  - Sync dữ liệu lên Elasticsearch
- **Quản lý chủ đề (Topic):**
  - Thêm, sửa, xóa chủ đề
  - Gán chủ đề vào môn học
  - Sync dữ liệu lên Elasticsearch
- **Quản lý Quiz:**
  - Tạo quiz mới
  - Thiết lập thời gian làm bài
  - Thêm/sửa/xóa câu hỏi
  - Thêm giải thích cho đáp án
  - Sync dữ liệu lên Elasticsearch
- **Thống kê hệ thống:**
  - Tổng số user đăng ký
  - Số quiz được tạo
  - Số lượt làm bài
  - Top quiz phổ biến
  - Báo cáo hàng ngày

---

## ⚙️ Hướng dẫn cài đặt

### 🔧 Công cụ cần thiết:

#### Backend
| Công cụ | Phiên bản | Tải về |
|---------|-----------|--------|
| Node.js | 18.x+ | [https://nodejs.org/](https://nodejs.org/) |
| MongoDB | 6.x+ | [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) |
| Elasticsearch | 8.x | [https://www.elastic.co/downloads/elasticsearch](https://www.elastic.co/downloads/elasticsearch) |
| VS Code hoặc IntelliJ | Latest | [https://code.visualstudio.com/](https://code.visualstudio.com/) |
| Postman | Latest | [https://www.postman.com/downloads/](https://www.postman.com/downloads/) |

#### Frontend
| Công cụ | Phiên bản | Tải về |
|---------|-----------|--------|
| Node.js | 18.x+ | [https://nodejs.org/](https://nodejs.org/) |
| npm hoặc yarn | Latest | Đi kèm với Node.js |

### 📥 Các bước cài đặt:

#### 1. Clone repository:
# Câu lệnh
git clone https://github.com/your-username/scifun.git

#### 1. Backend (Node.js + Express + MongoDB):
```bash
# Clone repository
cd scifun-api

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp .env.example .env
```

**Cấu hình file `.env`:**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/scifun

# JWT
JWT_SECRET=your-super-secret-key-here-change-this
JWT_EXPIRES=7d

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password

# Cloudinary
CLOUD_NAME=your-cloudinary-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Elasticsearch (Optional)
ES_NODE=http://localhost:9200

# Client URL
CLIENT_URL=http://localhost:3000
```

**Lấy Gmail App Password:**
1. Vào [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Bật **2-Step Verification**
3. Vào [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Tạo app password mới cho "SciFun"
5. Copy password 16 ký tự và paste vào `.env`

**Lấy Cloudinary credentials:**
1. Đăng ký tài khoản tại [https://cloudinary.com/](https://cloudinary.com/)
2. Vào Dashboard
3. Copy **Cloud Name**, **API Key**, **API Secret**

**Chạy Backend:**
```bash
# Development mode (nodemon)
npm run dev

# Production mode
npm run build
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

#### 2. Database (MongoDB):

**Cách 1: Cài đặt local**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Khởi động MongoDB
sudo systemctl start mongodb
# Hoặc
mongod
```

**Cách 2: Sử dụng Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 3. Elasticsearch (Optional - Cho tìm kiếm nâng cao):

**Cách 1: Cài đặt local**
```bash
# Download và cài đặt
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.0-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.11.0-linux-x86_64.tar.gz
cd elasticsearch-8.11.0

# Chạy Elasticsearch
./bin/elasticsearch
```

**Cách 2: Docker**
```bash
docker run -d -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.11.0
```

**Kiểm tra Elasticsearch:**
```bash
curl http://localhost:9200
```

#### 4. Frontend (React.js):
```bash
cd ../frontend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
```

**Cấu hình file `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Chạy Frontend:**
```bash
# Development mode
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

#### 5. Seed Database (Dữ liệu mẫu):
```bash
cd backend

# Chạy script seed data
npm run seed

# Hoặc import file SQL
mongorestore --db scifun ./database/dump
```

---

## 📦 Công nghệ sử dụng

### Backend Technologies

| Công nghệ | Phiên bản | Mục đích | NPM Package |
|-----------|-----------|----------|-------------|
| Node.js | 18.x | JavaScript Runtime | [https://nodejs.org/](https://nodejs.org/) |
| Express.js | 4.18.x | Web Framework | `npm install express` |
| TypeScript | 5.x | Type Safety | `npm install typescript` |
| MongoDB | 6.x | Database NoSQL | [https://www.mongodb.com/](https://www.mongodb.com/) |
| Mongoose | 8.x | MongoDB ODM | `npm install mongoose` |
| Elasticsearch | 8.x | Search Engine | [https://www.elastic.co/](https://www.elastic.co/) |
| Socket.IO | 4.x | WebSocket Realtime | `npm install socket.io` |
| JWT | 9.x | Authentication | `npm install jsonwebtoken` |
| Bcrypt | 5.x | Password Hashing | `npm install bcrypt` |
| Nodemailer | 6.x | Email Service | `npm install nodemailer` |
| Cloudinary | 1.x | Image Storage | `npm install cloudinary` |
| Multer | 1.x | File Upload | `npm install multer` |
| Node-Cron | 3.x | Scheduled Jobs | `npm install node-cron` |
| Dotenv | 16.x | Environment Variables | `npm install dotenv` |

### Frontend Technologies

| Công nghệ | Phiên bản | Mục đích | NPM Package |
|-----------|-----------|----------|-------------|
| React.js | 18.x | UI Library | `npx create-react-app frontend` |
| Bootstrap | 5.x | CSS Framework | `npm install bootstrap` |
| Axios | 1.x | HTTP Client | `npm install axios` |
| Socket.IO Client | 4.x | WebSocket Client | `npm install socket.io-client` |
| React Router | 6.x | Routing | `npm install react-router-dom` |
| React Hot Toast | 2.x | Notifications | `npm install react-hot-toast` |
| Chart.js | 4.x | Charts & Graphs | `npm install chart.js react-chartjs-2` |

---

## 🧪 Testing

Tài liệu này mô tả kế hoạch kiểm thử cho dự án **SciFun**. Mục tiêu:

- ✅ Xác minh tính đúng đắn của các chức năng học tập (xem nội dung, làm quiz, thống kê tiến độ)
- ✅ Kiểm tra hệ thống thông báo realtime (WebSocket + Email)
- ✅ Phát hiện và ghi nhận lỗi kịp thời trước khi triển khai

**Chạy tests:**
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📧 Liên hệ

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ nhóm phát triển:

- **Email:** contact@scifun.com
- **GitHub Issues:** [https://github.com/your-username/scifun/issues](https://github.com/your-username/scifun/issues)
- **Facebook:** [https://facebook.com/scifun](https://facebook.com/scifun)

---

## 👥 Nhóm phát triển

- **Nguyễn Văn A** - Full-stack Developer - [GitHub](https://github.com/user-a)
- **Trần Thị B** - Frontend Developer - [GitHub](https://github.com/user-b)
- **Lê Văn C** - Backend Developer - [GitHub](https://github.com/user-c)

---

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

---

**Made with ❤️ by SciFun Team**

⭐ Nếu bạn thấy project hữu ích, hãy cho chúng tôi một star trên GitHub!
