import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { loginApi } from "../util/api";
import { notification } from "antd";
import { AuthContext } from "../components/context/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) return null; // tránh lỗi null
  const { setAuth } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Đang submit:", email, password);

    try {
      const res = await loginApi(email, password);
      console.log("Kết quả API:", res);

      // 🔑 Lưu token + user vào localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: res.data.email,
          name: res.data.fullname,
          avatar: res.data.avatar,
        })
      );

      // 🔑 Set auth context
      setAuth({
        isAuthenticated: true,
        user: {
          email: res.data.email,
          name: res.data.fullname,
          avatar: res.data.avatar,
        },
      });

      notification.success({
        message: "LOGIN",
        description: res.message || "Đăng nhập thành công",
      });

      navigate("/");
    } catch (err: any) {
      notification.error({
        message: "LOGIN",
        description: err.response?.data?.message || "Đăng nhập thất bại",
      });
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormInput
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text="Đăng nhập" type="submit" variant="primary" />
      </form>
      <div className="mt-3 text-center">
        <Link to="/forgotpassword">Quên mật khẩu?</Link>
      </div>
      <div className="mt-2 text-center">
        Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </div>
    </AuthLayout>
  );
}
