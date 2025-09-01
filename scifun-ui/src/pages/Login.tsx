import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { loginApi } from "../util/api";
import { notification } from "antd";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await loginApi(email, password);
      console.log("API response:", res);
  
      notification.success({
        message: "CREATE USER",
        description: res.data?.message || "Đăng ký thành công",
      });
    } catch (err: any) {
  
      notification.error({
        message: "CREATE USER",
        description: err.response?.data?.message || "Đăng ký thất bại",
      });
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit}>
        <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormInput label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button text="Đăng nhập" type="submit" variant="primary" />
      </form>
      <div className="mt-3 text-center">
        <Link to="/otp">Quên mật khẩu?</Link>
      </div>
    </AuthLayout>
  );
}
