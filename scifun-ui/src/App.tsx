import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Otp from "./pages/Otp";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <nav id="nav-header-id" className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Trang chủ</Link>
          <div>
            <Link className="nav-link d-inline text-white" to="/login">Đăng nhập</Link>
            <Link className="nav-link d-inline text-white" to="/register">Đăng ký</Link>
            <Link className="nav-link d-inline text-white" to="/profile">Hồ sơ</Link>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}
