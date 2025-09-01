import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Gửi OTP về email: ${email}`);
  };

  return (
    <AuthLayout title="Quên mật khẩu">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button text="Gửi OTP" type="submit" variant="danger" />
      </form>
    </AuthLayout>
  );
}
