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
  const [errors, setErrors] = useState<{
    fullname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    subtitle?: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullname) newErrors.fullname = "Họ và tên là bắt buộc.";

    if (!email) {
      newErrors.email = "Email là bắt buộc.";
    } else if (!email.includes("@")) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) {
      return;
    }
    try {
      setLoading(true); // ✅ bật loading
      const res = await createUserApi(email, password, fullname);

      setToast({
        message: "Đăng ký thành công!",
        subtitle: res.data?.message || "Tài khoản của bạn đã được tạo.",
        type: "success",
      });

      // ✅ Toast thông báo đang chuyển
      setTimeout(() => {
        setToast({
          message: "Vui lòng kiểm tra email!",
          subtitle: "Đang chuyển bạn đến trang nhập mã OTP...",
          type: "info",
        });
      }, 800);

      setTimeout(() => {
        navigate("/otp", {
          state: { email, password, fullname, flow: "register" },
        });
      }, 2000);
    } catch (err: any) {
      setToast({
        message: "Đăng ký thất bại!",
        subtitle: err.response?.data?.message || "Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false); // ✅ tắt loading
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
            src="https://res.cloudinary.com/dglm2f7sr/image/upload/v1762095330/scifun_q6nehn.png"
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
            flexDirection: "column",
          }}
        >
          <h4 className="text-center mb-3">Đăng ký</h4>
          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Input
                label="Họ và tên"
                type="text"
                placeholder="Nhập họ và tên"
                value={fullname}
                onChange={(e) => {
                  setFullname(e.target.value);
                  if (submitted) validate();
                }}
                required
                error={errors.fullname}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitted) validate();
                }}
                required
                error={errors.email}
              />
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (submitted) validate();
                }}
                required
                error={errors.password}
              />
              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (submitted) validate();
                }}
                required
                error={errors.confirmPassword}
              />
            </div>

            <div>
              <Button
                type="submit"
                style={{ width: "100%", marginTop: "10px" }}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
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
