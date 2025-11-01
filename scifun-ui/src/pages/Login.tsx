import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../util/api";
import { AuthContext } from "../components/context/auth.context";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Toast from "../components/common/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    subtitle?: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { setAuth } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginApi(email, password);
      console.log("user: ", res);
      const userData = res as any;
      console.log("userData: ", userData);

      // Parse sex từ backend (backend trả về 0 hoặc 1)
      let sexValue: 0 | 1 | undefined = undefined;
      if (userData.data.sex === 0 || userData.data.sex === "0") {
        sexValue = 0;
      } else if (userData.data.sex === 1 || userData.data.sex === "1") {
        sexValue = 1;
      }

      const user = {
        _id: userData.data._id,
        email: userData.data.email,
        fullname: userData.data.fullname,
        avatar: userData.data.avatar || undefined,
        dob: userData.data.dob || undefined,
        sex: sexValue,
        isPro: userData.data.subscription.status,
      };
      console.log("userInfo: ", user);

      const token = (res as any).token;
      if (token) {
        localStorage.setItem("token", token);
      }
      
      localStorage.setItem("user", JSON.stringify(user));

      setAuth({
        isAuthenticated: true,
        user,
      });

      setToast({
        message: "Đăng nhập thành công!",
        subtitle: `Chào mừng ${user.fullname}`,
        type: "success",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setToast({
        message: "Đăng nhập thất bại!",
        subtitle: err.response?.data?.message || "Vui lòng thử lại.",
        type: "error",
      });
    }
  };

  const cardWidth = 400;
  const cardHeight = 520;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d1e7dd",
        position: "relative",
      }}
    >
      {/* Logo SCIFUN - Góc trên bên trái */}
      <Link
        to="/"
        style={{
          position: "absolute",
          top: 20,
          left: 30,
          fontSize: 32,
          fontWeight: "bold",
          color: "#198754",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        SCIFUN
      </Link>

      <div
        style={{
          display: "flex",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backgroundColor: "#fff",
        }}
      >
        {/* Bên trái - Ảnh */}
        <div style={{ width: cardWidth, height: cardHeight }}>
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-hand-gesture-handshake-cooperation-technology-business-photography-map-map-business-people-image_789752.jpg"
            alt="Login Illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Bên phải - Form */}
        <div
          className="p-4"
          style={{
            width: cardWidth,
            height: cardHeight,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h4 className="text-center mb-3">Đăng nhập</h4>
          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Button type="submit" style={{ width: "100%", marginTop: "10px" }}>
                Đăng nhập
              </Button>

              <div style={{ marginTop: 12, textAlign: "center" }}>
                <Link to="/forgotpassword">Quên mật khẩu?</Link>
              </div>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          subtitle={toast.subtitle}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}