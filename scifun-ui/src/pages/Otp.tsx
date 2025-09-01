import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { otpVerify } from "../util/api";
import { notification } from "antd";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Nhận email từ trang Register
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ Gửi cả email + otp sang API
      const res = await otpVerify(email, otp);
      console.log("API response:", res);

      notification.success({
        message: "VERIFY OTP",
        description: res.data?.message || "Xác thực thành công",
      });
      navigate("/login");
    } catch (err: any) {
      notification.error({
        message: "VERIFY OTP",
        description: err.response?.data?.message || "Xác thực thất bại",
      });
    }
  };

  return (
    <AuthLayout title="Xác nhận OTP">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Mã OTP"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button text="Xác nhận" type="submit" variant="warning" />
      </form>
    </AuthLayout>
  );
}
