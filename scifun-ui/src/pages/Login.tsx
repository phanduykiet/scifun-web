import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../util/api";
import { AuthContext } from "../components/context/auth.context";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Toast from "../components/common/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    subtitle?: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { setAuth } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginApi(email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          email: res.data.email,
          fullname: res.data.fullname,
          avatar: res.data.avatar,
        })
      );

      setAuth({
        isAuthenticated: true,
        user: {
          _id: res.data._id,
          email: res.data.email,
          fullname: res.data.fullname,
          avatar: res.data.avatar,
        },
      });

      // ✅ Hiển thị Toast thành công
      setToast({
        message: "Đăng nhập thành công!",
        subtitle: `Chào mừng ${res.data.fullname}`,
        type: "success",
      });

      // Chờ 1.5 giây rồi chuyển trang
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      // ✅ Hiển thị Toast thất bại
      setToast({
        message: "Đăng nhập thất bại!",
        subtitle: err.response?.data?.message || "Vui lòng thử lại.",
        type: "error",
      });
    }
  };

  const cardWidth = 400;
  const cardHeight = 380;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
      }}
    >
      {/* Bên trái: ảnh */}
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <img
          src="https://free.vector6.com/wp-content/uploads/2021/03/0000000643-tre-em-hoc-tap-hoc-bai-giao-duc-mam-non-tai-hinh-png-125.png"
          alt="Login Illustration"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Bên phải: form */}
      <div style={{ width: cardWidth }}>
        <div className="card p-4 rounded">
          <h4 className="text-center mb-3">Đăng nhập</h4>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" style={{ width: "100%", marginTop: "10px" }}>
              Đăng nhập
            </Button>
          </form>

          <div style={{ marginTop: 12, textAlign: "center" }}>
            <Link to="/forgotpassword">Quên mật khẩu?</Link>
          </div>
          <div style={{ marginTop: 8, textAlign: "center" }}>
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </div>
      </div>

      {/* ✅ Hiển thị Toast nếu có */}
      {toast && (
        <Toast
          message={toast.message}
          subtitle={toast.subtitle}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
