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

// Quên mật khẩu với OTP
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgotPasswordService(email);
    res.json({ message: "OTP đã được gửi đến email" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Xác thực OTP để đặt lại mật khẩu
export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyResetOtpService(email, otp);
    res.json({ message: "OTP hợp lệ, bạn có thể đổi mật khẩu" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    await authService.resetPasswordService(email, newPassword);
    res.json({ message: "Mật khẩu đã được cập nhật" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};