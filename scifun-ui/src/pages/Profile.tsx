import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../components/context/auth.context";
import Header from "../components/layout/Header";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";
import { updateProfileApi } from "../util/api";
import Toast from "../components/common/Toast";

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { auth, setAuth } = authContext;

  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(auth.user.fullname || "");
  const [avatar, setAvatar] = useState(auth.user.avatar || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dob, setDob] = useState(auth.user.dob || "");
  const [sex, setSex] = useState<0 | 1 | undefined>(auth.user.sex);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  if (!auth.isAuthenticated) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Yêu cầu đăng nhập</h4>
          <p>Vui lòng đăng nhập để xem thông tin cá nhân của bạn.</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const file = fileInputRef.current?.files?.[0];
      const profileData = { fullname, avatar: file, dob: dob || undefined, sex };
      const res = await updateProfileApi(auth.user._id, profileData);
      const updatedUser = res.data?.user || res.data;

      setAuth({
        ...auth,
        user: {
          ...auth.user,
          fullname: updatedUser.fullname || fullname,
          avatar: updatedUser.avatar || avatar,
          dob: updatedUser.dob || dob,
          sex: updatedUser.sex !== undefined ? updatedUser.sex : sex,
        },
      });

      setFullname(updatedUser.fullname || fullname);
      setAvatar(updatedUser.avatar || avatar);
      setDob(updatedUser.dob || dob);
      setSex(updatedUser.sex !== undefined ? updatedUser.sex : sex);

      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }

      setEditing(false);
      setToast({ message: "Cập nhật thông tin thành công!", type: "success" });
    } catch (error: any) {
      console.error("Cập nhật thất bại:", error);
      setToast({ message: error.response?.data?.message || "Cập nhật thông tin thất bại!", type: "error" });
    }
  };

  const handleCancel = () => {
    setFullname(auth.user.fullname || "");
    setDob(auth.user.dob || "");
    setSex(auth.user.sex);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditing(false);
  };

  const handleAvatarClick = () => {
    if (editing && fileInputRef.current) fileInputRef.current.click();
  };

  const displayAvatar = avatarPreview || avatar || "https://cdn-icons-png.flaticon.com/512/219/219983.png";

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Chưa cập nhật";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  const getGenderText = (genderValue: 0 | 1 | undefined) => {
    if (genderValue === 0) return "Nam";
    if (genderValue === 1) return "Nữ";
    return "Chưa cập nhật";
  };

  return (
    <>
      <Header />
      <div className="container py-5" style={{ maxWidth: "1200px", marginTop: "70px" }}>
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={displayAvatar}
                    alt="avatar"
                    className="rounded-circle shadow"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      cursor: editing ? "pointer" : "default",
                      border: editing ? "3px dashed #0d6efd" : "3px solid #e9ecef",
                      transition: "all 0.3s ease"
                    }}
                    onClick={handleAvatarClick}
                  />
                  {editing && (
                    <div
                      className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center shadow"
                      style={{ width: "40px", height: "40px", cursor: "pointer" }}
                      onClick={handleAvatarClick}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} className="d-none" onChange={handleFileChange} />
                {editing && (
                  <p className="text-muted small mb-3">
                    Nhấn vào ảnh để thay đổi
                  </p>
                )}

                <h4 className="fw-bold mb-1">{fullname}</h4>
                <p className="text-muted mb-4">{auth.user.email}</p>

                {!editing ? (
                  <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={() => setEditing(true)} style={{ borderRadius: "8px" }}>
                    Chỉnh sửa hồ sơ
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button className="btn btn-success flex-fill py-2 fw-semibold" onClick={handleSave} style={{ borderRadius: "8px" }}>
                      Lưu
                    </button>
                    <button className="btn btn-outline-secondary flex-fill py-2 fw-semibold" onClick={handleCancel} style={{ borderRadius: "8px" }}>
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold text-center">Thông tin cá nhân</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Fullname */}
                  <div className="col-md-6">
                    <Input
                      label="Họ và tên"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Nhập họ và tên"
                      disabled={!editing}
                      rounded
                    />
                  </div>

                  {/* Email */}
<div className="col-md-6">
  <Input
    label="Email"
    type="email"
    value={auth.user.email}
    disabled={true} // không cho chỉnh sửa
    hint="Email không thể thay đổi"
    rounded
  />
</div>
                  {/* DOB */}
                  <div className="col-md-6">
                    <Input
                      label="Ngày sinh"
                      type="date"
                      value={dob ? dob.split("T")[0] : ""}
                      onChange={(e) => setDob(e.target.value)}
                      disabled={!editing}
                      rounded
                    />
                  </div>

                  {/* Gender */}
                  <div className="col-md-6">
                    <div className="p-3" style={{
                      backgroundColor: editing ? "#fff" : "#f8f9fa",
                      borderRadius: "12px",
                      border: editing ? "2px solid #0d6efd" : "none",
                      transition: "all 0.3s ease"
                    }}>
                      <small className="text-secondary d-block mb-2 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>Giới tính</small>
                      {editing ? (
                        <select
                          className="form-select border-0 p-0 fw-semibold"
                          value={sex === undefined ? "" : sex}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSex(val === "" ? undefined : Number(val) as 0 | 1);
                          }}
                          style={{ backgroundColor: "transparent" }}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="0">Nam</option>
                          <option value="1">Nữ</option>
                        </select>
                      ) : (
                        <div className="fw-semibold">{getGenderText(sex)}</div>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                      <small className="text-secondary d-block mb-2 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>Mật khẩu</small>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">••••••••</span>
                        <Link to="/change-password" className="btn btn-sm btn-outline-primary" style={{ borderRadius: "20px" }}>Đổi mật khẩu</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default Profile;
