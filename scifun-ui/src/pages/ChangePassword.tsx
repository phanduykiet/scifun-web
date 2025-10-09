import { useState } from "react";
import { Input, Button, Card, Form, Modal } from "antd";
import { changePasswordApi } from "../util/api";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal(); // 👈 cần hook này
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      modal.error({
        title: "Đổi mật khẩu",
        content: "Mật khẩu mới và xác nhận không khớp!",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await changePasswordApi(
        user._id,
        values.currentPassword,
        values.newPassword,
        values.confirmPassword
      );

      // ✅ Hiện modal sau khi đổi mật khẩu
      modal.success({
        title: "Đổi mật khẩu",
        content: res.data?.message || "Đổi mật khẩu thành công!",
        onOk: () => navigate("/profile"),
        style: { top: 100 },
      });
    } catch (err: any) {
      modal.error({
        title: "Đổi mật khẩu",
        content: err.response?.data?.message || "Đổi mật khẩu thất bại",
      });
    } finally {
      setLoading(false);
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
      {contextHolder} {/* 👈 bắt buộc để modal hiển thị */}
      <Card title="Đổi mật khẩu" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu mới" }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} danger>
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
