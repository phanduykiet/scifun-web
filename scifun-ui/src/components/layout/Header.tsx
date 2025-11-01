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

  const handleStatisticClick = () => {
    if (auth.isAuthenticated) navigate("/statistic");
    else navigate("/login");
  };

  // Khi cuộn xuống một chút thì đổi màu navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top px-4 py-2 ${
          location.pathname === "/" && !scrolled
            ? "transparent-navbar"
            : "white-navbar"
        }`}
        style={{ zIndex: 1000 }}
      >
        {/* Logo */}
        <Link
          className={`navbar-brand fw-bold fs-4 ${
            location.pathname === "/" && !scrolled ? "text-white" : "text-success"
          }`}
          to="/"
        >
          Scifun
        </Link>

        {/* Nút toggle (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu chính */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto fw-semibold">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" && !scrolled
                    ? "text-white"
                    : "text-success"
                }`}
              >
                Trang chủ
              </Link>
            </li>

            <li className="nav-item">
              <a
                href="#lessons-section"
                className={`nav-link ${
                  location.pathname === "/" && !scrolled
                    ? "text-white"
                    : "text-success"
                }`}
              >
                Môn học
              </a>
            </li>

            {/* Các trang phụ */}
            <li className="nav-item">
              <a
                href="#quizzes-section"
                className={`nav-link ${
                  location.pathname === "/" && !scrolled
                    ? "text-white"
                    : "text-success"
                }`}
              >
                Bài học nổi bật
              </a>
            </li>

            <li className="nav-item">
              <Link
                to="/leaderboard"
                className={`nav-link ${
                  location.pathname === "/" && !scrolled
                    ? "text-white"
                    : "text-success"
                }`}
              >
                Bảng xếp hạng
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to={auth.isAuthenticated ? "/statistic" : "/login"}
                onClick={(e) => {
                  e.preventDefault();
                  handleStatisticClick();
                }}
                className={`nav-link ${
                  location.pathname === "/" && !scrolled
                    ? "text-white"
                    : "text-success"
                }`}
                style={{ cursor: "pointer" }}
              >
                Thống kê
              </Link>
            </li>
          </ul>

          {/* Khu vực đăng nhập / tài khoản */}
          <div className="d-flex align-items-center">
            {!auth.isAuthenticated ? (
              <Link
                to="/login"
                className={`btn fw-semibold ${
                  location.pathname === "/" && !scrolled
                    ? "btn-light text-success"
                    : "btn-success text-white"
                }`}
              >
                Đăng nhập
              </Link>
            ) : (
              <div className="dropdown">
                <button
                  className={`btn dropdown-toggle d-flex align-items-center fw-semibold ${
                    location.pathname === "/" && !scrolled
                      ? "btn-outline-light text-white border-white"
                      : "btn-outline-success"
                  }`}
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
                    <Link className="dropdown-item" to="/save-quiz">
                      Bài đã lưu
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/premium">
                      Nâng cấp tài khoản
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
        </div>
      </nav>
    </>
  );
};

export default Header;
