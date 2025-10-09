import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { otpVerify } from "../util/api";
import { notification, Input, Button, Card } from "antd";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận email + flow từ Register hoặc ForgotPassword
  const email = location.state?.email || "";
  const flow = location.state?.flow || "register"; // mặc định là đăng ký

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await otpVerify(email, otp);
      console.log("API response:", res);

      notification.success({
        message: "Xác thực OTP",
        description: res.data?.message || "Xác thực thành công",
      });

      // Điều hướng theo flow
      if (flow === "register") {
        navigate("/login");
      } else if (flow === "forgot") {
        navigate("/reset-password", { state: { email } });
      }
    } catch (err: any) {
      notification.error({
        message: "Xác thực OTP",
        description: err.response?.data?.message || "Xác thực thất bại",
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
      <Card title="Xác nhận OTP" style={{ width: 400 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>Mã OTP</label>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="primary" htmlType="submit" block>
            Xác nhận
          </Button>
        </form>
      </Card>
    </div>
  );
}
