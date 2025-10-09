import { createContext, useState, ReactNode, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  fullname: string;
  avatar?: string;
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
    user: { _id: "", email: "", fullname: "", avatar: "" },
  });

  const [appLoading, setAppLoading] = useState(true);

  // 🔑 Check localStorage khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(user),
      });
    }

    setAppLoading(false); // kết thúc giai đoạn loading
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
