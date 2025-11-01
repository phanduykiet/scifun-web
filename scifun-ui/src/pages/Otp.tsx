import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { otpVerify, createUserApi } from "../util/api";
import Button from "../components/ui/Button";
import Toast from "../components/common/Toast";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    subtitle?: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email || "";
  const password = location.state?.password || "";
  const fullname = location.state?.fullname || "";
  const flow = location.state?.flow || "register";

  useEffect(() => {
    // Focus vào ô đầu tiên khi load
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Chỉ cho phép số
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Quay lại ô trước khi nhấn Backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Kiểm tra paste có phải 6 số không
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      await createUserApi(email, password, fullname);
      
      setToast({
        message: "Gửi lại OTP thành công!",
        subtitle: "Vui lòng kiểm tra email của bạn",
        type: "success",
      });
    } catch (err: any) {
      setToast({
        message: "Gửi lại OTP thất bại!",
        subtitle: err.response?.data?.message || "Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setToast({
        message: "Vui lòng nhập đủ 6 số",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await otpVerify(email, otpString);

      setToast({
        message: "Xác thực thành công!",
        subtitle: res.data?.message || "Đang chuyển trang...",
        type: "success",
      });

      setTimeout(() => {
        if (flow === "register") {
          navigate("/login");
        } else if (flow === "forgot") {
          navigate("/reset-password", { state: { email } });
        }
      }, 1500);
    } catch (err: any) {
      setToast({
        message: "Xác thực thất bại!",
        subtitle: err.response?.data?.message || "Vui lòng thử lại.",
        type: "error",
      });
      // Reset OTP và focus lại ô đầu
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "20px",
        background: "#fff",
        borderTop: "5px solid #198754",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "40px 30px",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e9ecef",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 70,
              height: 70,
              margin: "0 auto 20px",
              background: "#198754",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            🔐
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 28, color: "#212529", fontWeight: 600 }}>
            Xác thực OTP
          </h2>
          <p style={{ margin: 0, color: "#6c757d", fontSize: 15 }}>
            Nhập mã 6 số đã được gửi đến
          </p>
          <p style={{ margin: "5px 0 0", color: "#198754", fontWeight: 600 }}>
            {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* 6 ô nhập OTP */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {inputRefs.current[index] = el}}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading}
                style={{
                  width: 55,
                  height: 60,
                  fontSize: 24,
                  fontWeight: 600,
                  textAlign: "center",
                  border: digit ? "2px solid #198754" : "2px solid #dee2e6",
                  borderRadius: 8,
                  outline: "none",
                  transition: "all 0.2s ease",
                  background: digit ? "#f8f9fa" : "white",
                  color: "#212529",
                }}
              />
            ))}
          </div>

          {/* Nút xác nhận */}
          <Button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: 16,
              fontWeight: 600,
              background: "#198754",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s ease",
              color: "white",
            }}
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : "Xác nhận"}
          </Button>

          {/* Gửi lại OTP */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#198754",
                fontSize: 14,
                cursor: resending ? "not-allowed" : "pointer",
                textDecoration: "underline",
                padding: "5px 10px",
                opacity: resending ? 0.6 : 1,
              }}
              onClick={handleResendOtp}
              disabled={resending}
            >
              {resending ? "Đang gửi..." : "Gửi lại mã OTP"}
            </button>
          </div>
        </form>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          subtitle={toast.subtitle}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* CSS cho hover effect */}
      <style>{`
        input:focus {
          border-color: #198754 !important;
          box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.1) !important;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #157347 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
        }
      `}</style>
    </div>
  );
}