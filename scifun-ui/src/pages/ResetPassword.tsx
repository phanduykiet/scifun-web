import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordApi } from "../util/api";
import { notification, Input, Button, Card } from "antd";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Nhận email từ OTP page
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await resetPasswordApi(email, password);
      console.log("Reset password response:", res);

      notification.success({
        message: "Đặt lại mật khẩu",
        description: res.data?.message || "Mật khẩu đã được đặt lại thành công",
      });

      navigate("/login");
    } catch (err: any) {
      console.error("Lỗi reset password:", err);
      notification.error({
        message: "Đặt lại mật khẩu",
        description: err.response?.data?.message || "Đặt lại mật khẩu thất bại",
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
      <Card title="Đặt lại mật khẩu" style={{ width: 400 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>Mật khẩu mới</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
