import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../util/api";
import { notification, Input, Button, Card } from "antd";
import { AuthContext } from "../components/context/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { setAuth } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginApi(email, password);

      // Lưu token + user
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

      // Set context
      setAuth({
        isAuthenticated: true,
        user: {
          _id: res.data._id,
          email: res.data.email,
          fullname: res.data.fullname,
          avatar: res.data.avatar,
        },
      });

      notification.success({
        message: "Đăng nhập thành công",
      });

      navigate("/");
    } catch (err: any) {
      notification.error({
        message: "Đăng nhập thất bại",
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
      <Card title="Đăng nhập" style={{ width: 400 }}>
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
            Đăng nhập
          </Button>
        </form>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Link to="/forgotpassword">Quên mật khẩu?</Link>
        </div>
        <div style={{ marginTop: 8, textAlign: "center" }}>
          Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </Card>
    </div>
  );
}
