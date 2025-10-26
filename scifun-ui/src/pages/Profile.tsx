import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../components/context/auth.context";
import Header from "../components/layout/Header";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";
import { updateProfileApi } from "../util/api";

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { auth, setAuth } = authContext;

  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(auth.user.fullname || "");
  const [avatar, setAvatar] = useState(auth.user.avatar || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dob, setDob] = useState(auth.user.dob || "");
  
  // ✅ Sửa: Dùng undefined thay vì ""
  const [sex, setSex] = useState<0 | 1 | undefined>(auth.user.sex);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
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
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    try {
      const file = fileInputRef.current?.files?.[0];

      const profileData = {
        fullname: fullname,
        avatar: file,
        dob: dob || undefined,
        sex: sex, // ✅ Đã là 0 | 1 | undefined, không cần check
      };

      const res = await updateProfileApi(auth.user._id, profileData);
      const updatedUser = res.data?.user || res.data;

      // ✅ Sửa: Kiểm tra !== undefined thay vì ||
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
      alert("Cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error("Cập nhật thất bại:", error);
      alert(error.response?.data?.message || "Cập nhật thông tin thất bại!");
    }
  };

  const handleCancel = () => {
    setFullname(auth.user.fullname || "");
    setDob(auth.user.dob || "");
    setSex(auth.user.sex); // ✅ Trả về giá trị gốc
    
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    setEditing(false);
  };

  const handleAvatarClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayAvatar = avatarPreview || avatar || "https://cdn-icons-png.flaticon.com/512/219/219983.png";

  // ✅ Helper function để format ngày
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Chưa cập nhật";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  // ✅ Helper function để hiển thị giới tính
  const getGenderText = (genderValue: 0 | 1 | undefined) => {
    if (genderValue === 0) return "Nam";
    if (genderValue === 1) return "Nữ";
    return "Chưa cập nhật";
  };

  return (
    <>
      <Header />
      <div className="container py-5" style={{ maxWidth: "1200px", marginTop: "70px"}}>
        <div className="row g-4">
          {/* Left Column - Avatar & Quick Info */}
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
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="d-none"
                  onChange={handleFileChange}
                />
                {editing && (
                  <p className="text-muted small mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    Nhấn vào ảnh để thay đổi
                  </p>
                )}
                
                <h4 className="fw-bold mb-1">{fullname}</h4>
                <p className="text-muted mb-4">{auth.user.email}</p>
                
                {!editing && (
                  <button
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    onClick={() => setEditing(true)}
                    style={{ borderRadius: "8px" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                    Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold text-center">
                  {editing ? "Chỉnh sửa thông tin cá nhân" : "Thông tin cá nhân"}
                </h5>
              </div>
              <div className="card-body p-4">
                {editing ? (
                  <div>
                    <Input
                      label="Họ và tên"
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Nhập họ và tên"
                      rounded={true}
                    />

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small text-uppercase mb-2">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={dob ? dob.split('T')[0] : ""} // ✅ Format ISO date
                          onChange={(e) => setDob(e.target.value)}
                          style={{ borderRadius: "20px", padding: "10px 12px" }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small text-uppercase mb-2">
                          Giới tính
                        </label>
                        <select
                          className="form-select"
                          value={sex === undefined ? "" : sex} // ✅ Sửa
                          onChange={(e) => {
                            const val = e.target.value;
                            setSex(val === "" ? undefined : Number(val) as 0 | 1);
                          }}
                          style={{ borderRadius: "20px", padding: "10px 12px" }}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="0">Nam</option>
                          <option value="1">Nữ</option>
                        </select>
                      </div>
                    </div>

                    <Input
                      label="Email"
                      type="email"
                      value={auth.user.email}
                      disabled
                      rounded={true}
                      hint="Email không thể thay đổi"
                      style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                    />

                    <div className="border-top pt-4 mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-semibold">Bảo mật</h6>
                        <Link
                          to="/change-password"
                          className="text-decoration-none small"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                          </svg>
                          Đổi mật khẩu
                        </Link>
                      </div>
                    </div>

                    <div className="d-flex gap-3 mt-4">
                      <button 
                        className="btn btn-success flex-fill py-2 fw-semibold" 
                        onClick={handleSave}
                        style={{ borderRadius: "20px" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        Lưu thay đổi
                      </button>
                      <button
                        className="btn btn-outline-secondary flex-fill py-2 fw-semibold"
                        onClick={handleCancel}
                        style={{ borderRadius: "20px" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                          <small className="text-secondary d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                            Họ và tên
                          </small>
                          <div className="fw-semibold">{fullname || "Chưa cập nhật"}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                          <small className="text-secondary d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                            Email
                          </small>
                          <div className="fw-semibold">{auth.user.email}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                          <small className="text-secondary d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                            Ngày sinh
                          </small>
                          <div className="fw-semibold">{formatDate(dob)}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                          <small className="text-secondary d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                            Giới tính
                          </small>
                          <div className="fw-semibold">
                            {getGenderText(sex)} {/* ✅ Dùng helper function */}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                          <small className="text-secondary d-block mb-1 text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                            Mật khẩu
                          </small>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">••••••••</span>
                            <Link
                              to="/change-password"
                              className="btn btn-sm btn-outline-primary"
                              style={{ borderRadius: "20px" }}
                            >
                              Đổi mật khẩu
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;