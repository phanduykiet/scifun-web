import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { auth, setAuth } = authContext;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({
      isAuthenticated: false,
      user: { email: "", name: "" },
    });
    navigate("/login");
  };

  return (
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
              {auth.user.name || auth.user.email}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Hồ sơ
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="dropdown-item">
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
