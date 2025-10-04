import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../components/context/auth.context";
import Header from "../components/layout/Header";
import { Link } from "react-router-dom";
import { updateProfileApi } from "../util/api";

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { auth, setAuth } = authContext;

  const [editing, setEditing] = useState(false);
  const [fullname, setName] = useState(auth.user.fullname || "");
  const [avatar, setAvatar] = useState(auth.user.avatar || "");
  

  // ref cho input file
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!auth.isAuthenticated) {
    return (
      <div className="container mt-5 text-center">
        <h4>Bạn chưa đăng nhập!</h4>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
    }
  };

  const handleSave = async () => {
    try {
      // Nếu user chọn file mới, tạo URL để lưu vào backend
      const file = fileInputRef.current?.files?.[0];
      let avatarToSend = auth.user.avatar; // mặc định là avatar cũ
      if (file) {
        avatarToSend = URL.createObjectURL(file); // hoặc convert sang base64 nếu backend yêu cầu
      }
  
      // Gửi object JSON thay vì FormData
      const dataToSend = {
        fullname,
        avatar: avatarToSend || "",
      };
  
      await updateProfileApi(auth.user._id, dataToSend);
  
      // Cập nhật local state
      setAuth({
        ...auth,
        user: {
          ...auth.user,
          fullname,
          avatar: avatarToSend,
        },
      });
  
      setEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error("Cập nhật thất bại:", error);
      alert("Cập nhật thông tin thất bại!");
    }
  };
  
  

  const handleAvatarClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click(); // mở hộp chọn file khi nhấn ảnh
    }
  };

  return (
    <>
      <Header />
      <div
        className="container d-flex justify-content-center align-items-start"
        style={{ minHeight: "80vh", marginTop: "50px" }}
      >
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <div className="text-center">
            {/* Avatar */}
            <img
              src={avatar || "https://via.placeholder.com/120"}
              alt="avatar"
              className="rounded-circle mb-3"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                cursor: editing ? "pointer" : "default",
                border: editing ? "2px dashed #0d6efd" : "none",
              }}
              onClick={handleAvatarClick}
            />
            {/* input file ẩn */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="d-none"
              onChange={handleFileChange}
            />
          </div>

          <hr />

          {editing ? (
            <div>
              <div className="mb-3">
                <label className="form-label fw-bold">Họ tên</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={fullname}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Link nhỏ đổi mật khẩu */}
              <div className="mb-3 text-end">
                <Link
                  to="/change-password"
                  className="text-decoration-none small text-primary"
                >
                  🔑 Đổi mật khẩu
                </Link>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-success btn-lg" onClick={handleSave}>
                  💾 Lưu thay đổi
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => setEditing(false)}
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="fs-5">
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Họ tên:</span>
                <span>{fullname}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Email:</span>
                <span>{auth.user.email}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Mật khẩu:</span>
                <span>********</span>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-primary btn-lg mt-3"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Chỉnh sửa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
