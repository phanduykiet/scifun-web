import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Lấy route hiện tại
  const topic = location.state as any;
  const subject = location.state as any;
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { auth, setAuth } = authContext;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({
      isAuthenticated: false,
      user: { _id: "", email: "", fullname: "" },
    });
    navigate("/login");
  };

  // ✅ Tạo breadcrumb theo URL
  const renderBreadcrumb = () => {
    const path = location.pathname;
    const state = location.state as any;
  
    // Ẩn breadcrumb khi đang ở trang chủ
    if (path === "/") return null;
  
    return (
      <nav className="bg-light px-3 py-2 border-bottom" style={{ fontSize: "14px" }}>
        <Link to="/" className="text-secondary text-decoration-none">Trang chủ</Link>
  
        {path.startsWith("/subject") && (
          <span className="text-muted"> &gt; <b>{state?.name || "Môn học"}</b></span>
        )}
  
        {path.startsWith("/topic") && (
          <>
            <span className="text-muted">
              {" "}
              &gt;{" "}
              <Link
                to={`/subject/${state?.subjectId}`}
                state={{ name: state?.subjectName }}
                className="text-secondary text-decoration-none"
              >
                {state?.subjectName || "Môn học"}
              </Link>
            </span>
            {state?.name && <span className="text-muted"> &gt; <b>{state.name}</b></span>}
          </>
        )}
      </nav>
    );
  };
  
  return (
    <>
      {/* ✅ Navbar chính */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">
          Scifun
        </Link>

        <div className="ms-auto d-flex align-items-center">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="form-control me-2"
            style={{ width: "200px" }}
          />
          {!auth.isAuthenticated ? (
            <Link to="/login" className="btn btn-primary">
              Đăng nhập
            </Link>
          ) : (
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {auth.user.avatar && (
                  <img
                    src={auth.user.avatar}
                    alt="avatar"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "8px",
                      objectFit: "cover",
                    }}
                  />
                )}
                {auth.user.fullname || auth.user.email}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Breadcrumb nằm dưới navbar */}
      {renderBreadcrumb()}
    </>
  );
};

export default Header;
