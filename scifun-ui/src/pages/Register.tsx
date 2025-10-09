import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserApi } from "../util/api";
import { notification, Input, Button, Card } from "antd";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUserApi(email, password);

      notification.success({
        message: "Đăng ký thành công",
        description: res.data?.message || "Tài khoản đã được tạo",
      });

      navigate("/otp", { state: { email, flow: "register" } });
    } catch (err: any) {
      notification.error({
        message: "Đăng ký thất bại",
        description: err.response?.data?.message || "Vui lòng thử lại",
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
      <Card title="Đăng ký" style={{ width: 400 }}>
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
          <div style={{ marginBottom: 16 }}>
            <label>Mật khẩu</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </form>
      </Card>
    </div>
  );
}
