import { createContext, useState, ReactNode, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  fullname: string;
  avatar?: string;
  dob?: string;  // ngày sinh
  sex?: 0 | 1;   // giới tính: 0 = Nam, 1 = Nữ
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  appLoading: boolean;
  setAppLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: { _id: "", email: "", fullname: "", avatar: "", dob: "", sex: undefined },
  });

  const [appLoading, setAppLoading] = useState(true);

  // 🔑 Check localStorage khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);
      // chuyển sex sang 0 | 1 | undefined nếu cần
      parsedUser.sex = parsedUser.sex !== undefined ? Number(parsedUser.sex) as 0 | 1 : undefined;

      setAuth({
        isAuthenticated: true,
        user: parsedUser,
      });
    }

    setAppLoading(false); // kết thúc giai đoạn loading
  }, []);

  // 🔑 Đồng bộ user vào localStorage mỗi khi auth.user thay đổi
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem("user", JSON.stringify(auth.user));
    }
  }, [auth.user, auth.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
