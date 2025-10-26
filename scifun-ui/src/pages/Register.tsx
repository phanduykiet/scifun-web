import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserApi } from "../util/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Toast from "../components/common/Toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasHint, setHasHint] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    subtitle?: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasHint) {
      setToast({
        message: "Thông tin chưa hợp lệ!",
        subtitle: "Vui lòng kiểm tra lại các trường.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({
        message: "Mật khẩu không khớp!",
        subtitle: "Vui lòng kiểm tra lại mật khẩu và xác nhận mật khẩu.",
        type: "error",
      });
      return;
    }

    try {
      const res = await createUserApi(email, password, fullname);

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
  const cardHeight = 520;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d1e7dd",
      }}
    >
      {/* Container chung cho ảnh và form */}
      <div
        style={{
          display: "flex",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backgroundColor: "#fff",
        }}
      >
        {/* Bên trái - Ảnh */}
        <div
          style={{
            width: cardWidth,
            height: cardHeight,
          }}
        >
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-hand-gesture-handshake-cooperation-technology-business-photography-map-map-business-people-image_789752.jpg"
            alt="Register Illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Bên phải - Form */}
        <div 
          className="p-4" 
          style={{ 
            width: cardWidth,
            height: cardHeight,
            display: "flex", 
            flexDirection: "column" 
          }}
        >
          <h4 className="text-center mb-3">Đăng ký</h4>
          <form 
            onSubmit={handleSubmit}
            style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "space-between" 
            }}
          >
            <div>
              <Input
                label="Họ và tên"
                type="text"
                placeholder="Nhập họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                onHintChange={(hasHint) => setHasHint(hasHint)}
                required
              />
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
              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onHintChange={(hasHint) => setHasHint(hasHint)}
                required
              />
            </div>
            
            <div>
              <Button
                type="submit"
                style={{ width: "100%", marginTop: "10px" }}
                disabled={hasHint}
              >
                Đăng ký
              </Button>

              <div style={{ marginTop: 12, textAlign: "center" }}>
                Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
              </div>
            </div>
          </form>
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