import React, { useContext, useState } from "react";
import { AuthContext } from "../components/context/auth.context";
import Header from "../components/layout/Header";

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { auth, setAuth } = authContext;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(auth.user.name || "");
  const [avatar, setAvatar] = useState(auth.user.avatar || "");
  const [password, setPassword] = useState("");

  if (!auth.isAuthenticated) {
    return (
      <div className="container mt-5 text-center">
        <h4>Bạn chưa đăng nhập!</h4>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: gọi API update profile ở backend (PUT/PATCH)
    // hiện tại chỉ update context
    setAuth({
      ...auth,
      user: {
        ...auth.user,
        name,
        avatar,
      },
    });
    setEditing(false);
    alert("Cập nhật thông tin thành công!");
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
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            {editing ? (
              <input
                type="text"
                className="form-control mb-2"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Link ảnh avatar"
              />
            ) : null}
            <h3 className="mb-0">{name || "Người dùng"}</h3>
            <p className="text-muted">{auth.user.email}</p>
          </div>

          <hr />

          {editing ? (
            <div>
              <div className="mb-3">
                <label className="form-label">Họ tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <button className="btn btn-success me-2" onClick={handleSave}>
                Lưu thay đổi
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Hủy
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2">
                <strong>Họ tên:</strong> {name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {auth.user.email}
              </p>
              <p className="mb-2">
                <strong>Mật khẩu:</strong> ********
              </p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => setEditing(true)}
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
