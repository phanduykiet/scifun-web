import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { createUserApi } from "../util/api";
import { notification } from "antd";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await createUserApi(email, password);
      console.log("API response:", res);
  
      notification.success({
        message: "CREATE USER",
        description: res.data?.message || "Đăng ký thành công",
      });
  
      navigate("/otp", { state: { email } });
    } catch (err: any) {
  
      notification.error({
        message: "CREATE USER",
        description: err.response?.data?.message || "Đăng ký thất bại",
      });
    }
  };
  
  

  return (
    <AuthLayout title="Đăng ký">
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
        <Button text="Đăng ký" type="submit" variant="success" />
      </form>
    </AuthLayout>
  );
}
