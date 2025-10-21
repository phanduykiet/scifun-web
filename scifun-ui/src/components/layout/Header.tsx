import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import "../../styles/Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

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

  // Detect scroll để thay đổi màu navbar
  useEffect(() => {
  
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);  

  // Breadcrumb
  const renderBreadcrumb = () => {
    const path = location.pathname;
    const state = location.state as any;
    if (path === "/") return null;

    return (
      <nav className="bg-light px-3 py-2 border-bottom" style={{ fontSize: "14px" }}>
        <Link to="/" className="text-secondary text-decoration-none">
          Trang chủ
        </Link>
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
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg fixed-top px-3 ${
          location.pathname === "/"
            ? "transparent-navbar navbar-dark"
            : "scrolled-navbar navbar-light"
        }`}
      >
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

      {/* Breadcrumb */}
      {renderBreadcrumb() && (
        <div style={{ paddingTop: "70px" }}>
          {renderBreadcrumb()}
        </div>
      )}
    </>
  );
};

export default Header;
