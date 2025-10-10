import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserApi } from "../util/api";
import { notification, Card } from "antd";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

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

  const cardWidth = 400;
  const cardHeight = 380; // giống Login

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
          alt="Register Illustration"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Bên phải: form */}
      <div
        style={{
          width: cardWidth,
        }}
      >
        <Card
          title={<div style={{ textAlign: "center" }}>Đăng ký</div>}
          style={{ width: "100%", height: "390px", borderRadius: 12 }}
        >
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
              Đăng ký
            </Button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
