import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

type User = {
  name: string;
  email: string;
};

export default function Profile() {
  const [user, setUser] = useState<User>({
    name: "Nguyễn Văn A",
    email: "vana@example.com",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đã lưu thông tin: ${JSON.stringify(user)}`);
  };

  return (
    <AuthLayout title="Hồ sơ cá nhân">
      <form onSubmit={handleSave}>
        <FormInput
          label="Họ và tên"
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <FormInput
          label="Email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <Button text="Lưu thay đổi" type="submit" variant="info" />
      </form>
    </AuthLayout>
  );
}
