import { Request, Response } from "express";
import * as authService from "../services/authService";

//Register có OTP
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await authService.registerUser(email, password);
    res.json({
      message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy OTP.",
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Xác thực OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyUserOtp(email, otp);
    res.json({ message: "Xác thực thành công" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Login có JWT
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token } = await authService.loginUser(email, password);
    res.json({ message: "Đăng nhập thành công", token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
