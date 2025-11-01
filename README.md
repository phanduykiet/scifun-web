# 📚 SCIFUN - HỆ THỐNG HỌC TẬP TRẮC NGHIỆM KHOA HỌC TỰ NHIÊN

## 🚀 Mô tả dự án

SciFun là nền tảng học tập trực tuyến chuyên về kiến thức khoa học tự nhiên thông qua hình thức trắc nghiệm tương tác. Hệ thống cung cấp kho bài tập phong phú, theo dõi tiến độ học tập realtime, hỗ trợ thông báo qua WebSocket và Email, tìm kiếm nhanh chóng với Elasticsearch. Dành cho học sinh, sinh viên và giáo viên với giao diện thân thiện, responsive trên mọi thiết bị.

---

## 📱 Giao diện ứng dụng

### Cập nhật thông tin
![Cập nhật thông tin](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/cap_nhat_thong_tin.png?raw=true)

### Đăng ký
![Đăng ký](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/dang_ky.png?raw=true)

### Đăng nhập
![Đăng nhập](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/dang_nhap.png?raw=true)

### Đăng xuất
![Đăng xuất](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/dang_xuat.png?raw=true)

### Làm bài trắc nghiệm
![Làm bài trắc nghiệm](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/lam_bai_trac_nghiem.png?raw=true)

### Quên mật khẩu
![Quên mật khẩu](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/quen_mat_khau.png?raw=true)

### Thống kê
![Thống kê](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/thong_ke.png?raw=true)

### Tìm kiếm chủ đề
![Tìm kiếm chủ đề](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/tim_kiem_chu_de.png?raw=true)

### Xem đáp án
![Xem đáp án](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/xem_dap_an.png?raw=true)

### Xem danh sách chủ đề
![Xem danh sách chủ đề](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/xem_ds_chu_de.png?raw=true)

### Xem video
![Xem video](https://github.com/phanduykiet/scifun-web/blob/main/scifun-ui/src/assets/xem_video.png?raw=true)


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

---

### 📥 Cài đặt dự án:

#### 1. Clone Repository:
```bash
# Clone repository
git clone https://github.com/phanduykietphanduykiet/scifun.git
cd scifun
```

**Cấu trúc thư mục:**
```
scifun/
├── scifun-api/          # Backend (Node.js + Express)
├── scifun-ui/           # Frontend (React + Vite)
└── README.md
```

---

### 🖥️ Setup Backend (scifun-api)

#### Bước 1: Cài đặt dependencies
```bash
# Di chuyển vào thư mục backend
cd scifun-api

# Cài đặt packages
npm install
```

#### Bước 2: Cấu hình Environment Variables
```bash
# Tạo file .env từ template
cp .env.example .env
```

**Nội dung file `.env`:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (Frontend)
CLIENT_URL=http://localhost:5173

# MongoDB Database
MONGO_URI=mongodb://127.0.0.1:27017/scifun_db

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES=1h

# Email Configuration (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# Elasticsearch Cloud
ES_NODE=https://your-deployment.es.region.gcp.elastic.cloud:443
ES_API_KEY=your-elasticsearch-api-key-here

# Cloudinary Storage
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# ZaloPay Payment Gateway (Sandbox)
ZP_APP_ID=2554
ZP_KEY1=your-zalopay-key1-from-sandbox
ZP_CREATE_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create
ZP_QUERY_ENDPOINT=https://sb-openapi.zalopay.vn/v2/query
```

#### Bước 3: Setup Database

**Cài đặt MongoDB:**

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
1. Tải MongoDB Installer từ [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Chạy file installer và làm theo hướng dẫn
3. Khởi động MongoDB từ Services

**Import Database:**
```bash
# Di chuyển vào thư mục database
cd scifun-api/database

# Import database từ file backup
mongorestore --db scifun_db ./backup

# Hoặc nếu có file .bak
mongorestore --db scifun_db --archive=./backup/scifun_db.bak
```

**Kiểm tra Database:**
```bash
# Mở MongoDB Shell
mongosh

# Chọn database
use scifun_db

# Xem danh sách collections
show collections

# Đếm số documents
db.users.countDocuments()
db.quizzes.countDocuments()

# Thoát
exit
```

#### Bước 4: Cấu hình Elasticsearch Cloud

**SciFun sử dụng Elasticsearch Cloud, không cần cài đặt local.**

Truy cập: [https://my-elasticsearch-project-a04988.kb.us-central1.gcp.elastic.cloud](https://my-elasticsearch-project-a04988.kb.us-central1.gcp.elastic.cloud/app/elasticsearch/home)

**Lấy Endpoint URL:**
1. Vào **Deployments** → Chọn **my-elasticsearch-project-a04988**
2. Trong phần **Applications**, tìm **Elasticsearch**
3. Copy URL endpoint (format: `https://xxx.es.us-central1.gcp.elastic.cloud:443`)
4. Paste vào `ES_NODE` trong file `.env`

**Tạo API Key:**
1. Click **Open Kibana** từ deployment
2. Vào **☰ Menu** → **Management** → **Stack Management**
3. Chọn **Security** → **API Keys**
4. Click **Create API key**
5. Điền thông tin:
   - **Name**: `SciFun Backend`
   - **Expiration**: Để trống (không hết hạn)
6. Click **Create API key**
7. **Quan trọng:** Copy **Encoded** API key (chỉ hiện 1 lần!)
8. Paste vào `ES_API_KEY` trong `.env`

**Test kết nối:**
```bash
curl -H "Authorization: ApiKey YOUR_API_KEY" https://your-endpoint.es.us-central1.gcp.elastic.cloud:443
```

#### Bước 5: Chạy Backend Server
```bash
# Trong thư mục scifun-api
npm run dev
```

✅ **Backend chạy thành công tại: http://localhost:5000/**

**Log khi chạy thành công:**
```
🚀 Server is running on http://localhost:5000
✅ MongoDB Connected: scifun_db
✅ Elasticsearch Connected: my-elasticsearch-project-a04988
⚡ WebSocket server is ready
📧 Email service initialized
☁️  Cloudinary connected
```

---

### 🎨 Setup Frontend (scifun-ui)

#### Bước 1: Cài đặt dependencies

**Mở terminal mới** (giữ terminal backend đang chạy):
```bash
# Từ thư mục gốc, di chuyển vào frontend
cd scifun-ui

# Cài đặt packages
npm install
```

#### Bước 2: Cấu hình Environment Variables
```bash
# Tạo file .env
cp .env.example .env
```

**Nội dung file `.env`:**
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# WebSocket URL
VITE_SOCKET_URL=http://localhost:5000
```

#### Bước 3: Chạy Frontend Development Server
```bash
# Trong thư mục scifun-ui
npm run start
```

✅ **Frontend chạy thành công tại: http://localhost:5173/**

**Kiểm tra:**
1. Mở trình duyệt: [http://localhost:5173](http://localhost:5173)
2. Bạn sẽ thấy trang chủ SciFun
3. Mở **Developer Console** (F12):
   - Không có lỗi kết nối API
   - WebSocket connected

---

### 📝 Hướng dẫn lấy Credentials

#### **1. Gmail App Password**

1. Truy cập [Google Account Security](https://myaccount.google.com/security)
2. Bật **2-Step Verification** (Xác thực 2 bước)
3. Vào [App Passwords](https://myaccount.google.com/apppasswords)
4. Chọn **Mail** và **Other (Custom name)**, đặt tên "SciFun"
5. Copy password 16 ký tự (dạng: `xxxx xxxx xxxx xxxx`)
6. **Xóa khoảng trắng** và paste vào `EMAIL_PASS` trong `.env`

**Ví dụ:**
```env
# Sai (có khoảng trắng)
EMAIL_PASS=abcd efgh ijkl mnop

# Đúng (không có khoảng trắng)
EMAIL_PASS=abcdefghijklmnop
```

---

#### **2. Cloudinary**

1. Đăng ký miễn phí tại [Cloudinary](https://cloudinary.com/users/register/free)
2. Sau khi đăng nhập, vào **Dashboard**
3. Copy các thông tin:
   - **Cloud name** → `CLOUD_NAME`
   - **API Key** → `CLOUD_API_KEY`
   - **API Secret** → `CLOUD_API_SECRET`

**Ví dụ:**
```env
CLOUD_NAME=dglm2f7sr
CLOUD_API_KEY=616287875981434
CLOUD_API_SECRET=WRKcek7fKoyzFe8iLeB6kMTTB8c
```

---

#### **3. JWT Secret**

Tạo chuỗi ngẫu nhiên an toàn (tối thiểu 32 ký tự):

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Hoặc dùng online:** [RandomKeygen](https://randomkeygen.com/)

**Lưu ý:** 
- Không chia sẻ JWT secret với ai
- Dùng secret khác cho development và production

---

#### **4. ZaloPay Sandbox**

1. Đăng ký tài khoản tại [ZaloPay Developers](https://docs.zalopay.vn/)
2. Đăng nhập và vào **Sandbox Environment**
3. Lấy credentials:
   - **App ID**: `2554` (mặc định cho sandbox)
   - **Key1**: Copy từ dashboard
4. Paste vào `.env`:
```env
ZP_APP_ID=2554
ZP_KEY1=sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn
```

---

**Lưu ý:** Đây là môi trường test, không dùng cho production

---

### ✅ Kiểm tra hoàn tất Setup

#### **1. Backend (scifun-api)**

**Terminal logs:**
```
🚀 Server is running on http://localhost:5000
✅ MongoDB Connected: scifun_db
✅ Elasticsearch Connected: my-elasticsearch-project-a04988
⚡ WebSocket server is ready
📧 Email service initialized
☁️  Cloudinary connected
```

---

#### **2. Frontend (scifun-ui)**

**Browser:**
- ✅ Trang chủ hiển thị đầy đủ
- ✅ Không có lỗi trong Console
- ✅ WebSocket connected (check Console: "Socket connected")
- ✅ API calls thành công (Network tab: status 200)

---

### 🔧 Troubleshooting

#### **Backend không khởi động được**

**MongoDB connection error:**
```bash
# Kiểm tra MongoDB đang chạy
sudo systemctl status mongodb

# Hoặc trên Mac
brew services list | grep mongodb

# Restart MongoDB
sudo systemctl restart mongodb

# Mac
brew services restart mongodb-community
```

**Port 5000 bị chiếm:**
```bash
# Kiểm tra process đang dùng port
lsof -i :5000

# Kill process (thay )
kill -9 

# Hoặc đổi PORT trong .env
PORT=5001
```

---

#### **Elasticsearch không kết nối**

- ✅ Kiểm tra `ES_NODE` có đúng format: `https://xxx.es.region.gcp.elastic.cloud:443`
- ✅ Verify `ES_API_KEY` còn hiệu lực (tạo key mới nếu cần)

---

#### **Email không gửi được**

- ✅ Verify Gmail App Password đã tạo đúng
- ✅ Xóa khoảng trắng trong password
- ✅ Kiểm tra 2-Step Verification đã bật

---

#### **Cloudinary upload lỗi**

- ✅ Verify credentials từ Dashboard
- ✅ Check Cloud Name không có khoảng trắng
- ✅ Test với ảnh nhỏ (<1MB)
- ✅ Kiểm tra quota free tier

---

## 📦 Công nghệ sử dụng

### Backend Technologies

| Công nghệ | Phiên bản | Mục đích | NPM Package |
|-----------|-----------|----------|-------------|
| Node.js | 18.x | JavaScript Runtime | [https://nodejs.org/](https://nodejs.org/) |
| Express.js | 4.18.x | Web Framework | `npm install express` |
| MongoDB | 6.x | Database NoSQL | [https://www.mongodb.com/](https://www.mongodb.com/) |
| Mongoose | 8.x | MongoDB ODM | `npm install mongoose` |
| Elasticsearch | 8.x | Search Engine (Cloud) | [https://www.elastic.co/](https://www.elastic.co/) |
| Socket.IO | 4.x | WebSocket Realtime | `npm install socket.io` |
| JWT | 9.x | Authentication | `npm install jsonwebtoken` |
| Bcrypt | 5.x | Password Hashing | `npm install bcrypt` |
| Nodemailer | 6.x | Email Service | `npm install nodemailer` |
| Cloudinary | 1.x | Image Storage | `npm install cloudinary` |
| Multer | 1.x | File Upload | `npm install multer` |
| Node-Cron | 3.x | Scheduled Jobs | `npm install node-cron` |
| Dotenv | 16.x | Environment Variables | `npm install dotenv` |
| Cors | 2.x | CORS Middleware | `npm install cors` |

### Frontend Technologies

| Công nghệ | Phiên bản | Mục đích | NPM Package |
|-----------|-----------|----------|-------------|
| React.js | 18.x | UI Library | `npm create vite@latest` |
| Vite | 5.x | Build Tool & Dev Server | Built-in with Vite |
| Bootstrap | 5.x | CSS Framework | `npm install bootstrap` |
| Axios | 1.x | HTTP Client | `npm install axios` |
| Socket.IO Client | 4.x | WebSocket Client | `npm install socket.io-client` |
| React Router | 6.x | Routing | `npm install react-router-dom` |
| React Hot Toast | 2.x | Notifications | `npm install react-hot-toast` |
| Chart.js | 4.x | Charts & Graphs | `npm install chart.js react-chartjs-2` |
| React Icons | 5.x | Icon Library | `npm install react-icons` |

---

## 🚀 Chạy cả Backend và Frontend cùng lúc

### Dùng 2 Terminal riêng:

**Terminal 1 - Backend:**
```bash
cd scifun-api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd scifun-ui
npm run start
```

---

## 📧 Liên hệ

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ nhóm phát triển:

- **Email:** phanduykiet22@gmail.com
- **GitHub Issues:** ...
- **Facebook:** ...
- **Documentation:** ...

---

## 👥 Nhóm phát triển

- **Phan Duy Kiệt** - Backend Developer
- **Phùng Gia Long** - Frontend Developer
- **Trương Quốc Duy** - Frontend Developer
---

**Made with ❤️ by SciFun Team**

⭐ Nếu bạn thấy project hữu ích, hãy cho chúng tôi một star trên GitHub!

📚 Happy Learning with SciFun! 🎓
