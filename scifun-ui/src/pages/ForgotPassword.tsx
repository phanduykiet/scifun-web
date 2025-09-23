import { useState } from "react";
import { Input, Button, Card, notification } from "antd";
import { forgotPasswordApi } from "../util/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPasswordApi(email); // Gọi API
      console.log("Forgot password response:", res);

      notification.success({
        message: "Quên mật khẩu",
        description: res.data?.message || `OTP đã được gửi về email: ${email}`,
      });

      // Chuyển hướng sang trang OTP, truyền email sang
      navigate("/otp", { state: { email, flow: "forgot" } });

    } catch (err: any) {
      console.error("Lỗi gửi OTP:", err);
      notification.error({
        message: "Quên mật khẩu",
        description: err.response?.data?.message || "Gửi OTP thất bại",
      });
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
      }}
    >
      <Card title="Quên mật khẩu" style={{ width: 400 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="primary" danger htmlType="submit" block>
            Gửi OTP
          </Button>
        </form>
      </Card>
    </div>
  );
}
