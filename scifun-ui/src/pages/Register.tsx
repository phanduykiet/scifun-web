import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserApi } from "../util/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Toast from "../components/common/Toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasHint, setHasHint] = useState(false); // ✅ theo dõi lỗi từ input
  const [toast, setToast] = useState<{
    message: string;
    subtitle?: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Kiểm tra nếu còn lỗi thì không cho đăng ký
    if (hasHint) {
      setToast({
        message: "Thông tin chưa hợp lệ!",
        subtitle: "Vui lòng kiểm tra lại email hoặc mật khẩu.",
        type: "error",
      });
      return;
    }

    try {
      const res = await createUserApi(email, password);

      setToast({
        message: "Đăng ký thành công!",
        subtitle: res.data?.message || "Tài khoản của bạn đã được tạo.",
        type: "success",
      });

      setTimeout(() => {
        navigate("/otp", { state: { email, flow: "register" } });
      }, 1500);
    } catch (err: any) {
      setToast({
        message: "Đăng ký thất bại!",
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
      {/* Bên trái */}
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
          alt="Register Illustration"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Bên phải */}
      <div style={{ width: cardWidth }}>
        <div className="card p-4 rounded">
          <h4 className="text-center mb-3">Đăng ký</h4>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onHintChange={(hasHint) => setHasHint(hasHint)}
              required
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onHintChange={(hasHint) => setHasHint(hasHint)}
              required
            />
            <Button
              type="submit"
              style={{ width: "100%", marginTop: "10px" }}
              disabled={hasHint} // ✅ nút bị khóa khi còn lỗi
            >
              Đăng ký
            </Button>
          </form>

          <div style={{ marginTop: 12, textAlign: "center" }}>
            Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>
        </div>
      </div>

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
