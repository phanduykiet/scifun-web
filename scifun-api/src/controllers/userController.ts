import { Request, Response } from "express";
import * as authService from "../services/userService";
import { checkAndUpdateSubscriptionStatus } from "../services/subscriptionService";
import cloudinary from "../config/cloudinary";

//Register có OTP
export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const user = await authService.registerUserSv(userData);

    res.status(200).json({
      status: 200,
      message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy OTP.",
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Xác thực OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyUserOtpSv(email, otp);
    res.status(200).json({
      status: 200,
      message: "Xác thực thành công",
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Login có JWT
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUserSv(email, password);
    await checkAndUpdateSubscriptionStatus(user._id.toString());
    res.status(200).json({
      status: 200,
      message: "Đăng nhập thành công",
      token: token,
      data: user
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Quên mật khẩu với OTP
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgotPasswordSv(email);
    res.status(200).json({ 
      status: 200,
      message: "OTP đã được gửi đến email" 
    });
  } catch (err: any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};

// Xác thực OTP để đặt lại mật khẩu
export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyResetOtpSv(email, otp);
    res.status(200).json({ 
      status: 200,
      message: "OTP hợp lệ, bạn có thể đổi mật khẩu" 
    });
  } catch (err: any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};

// Đặt lại mật khẩu (Khi quên mật khẩu)
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    await authService.resetPasswordSv(email, newPassword);
    res.status(200).json({ 
      status: 200,
      message: "Mật khẩu đã được cập nhật" 
    });
  } catch (err: any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const updateData = req.body;
    const authenticatedUserId = req.user!.userId;
    // Nếu có file ảnh (từ form-data)
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "Avatar" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        upload.end(req.file.buffer); // đưa buffer ảnh vào stream
      });

      updateData.avatar = (uploadResult as any).secure_url;
    }
    const updatedUser = await authService.updateUserSv(_id, updateData, authenticatedUserId);
    res.status(200).json({ 
      status: 200, 
      message: "Cập nhật thành công", 
      data: updatedUser });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Cập nhât mật khẩu
export const updatePassword = async (req: Request, res: Response) =>{
  try{
    const { _id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    await authService.updatePasswordSv(_id, oldPassword, newPassword, confirmPassword);
    res.status(200).json({
      status: 200,
      message: "Cập nhật mật khẩu thành công"
    });
  } catch(err: any){
    res.status(400).json({
      status: 400,
      message: err.message,
    })
  }
}

// Xóa người dùng
export const deleteUser = async (req: Request, res: Response) =>{
  try{
    const { _id } = req.params;
    await authService.deleteUserSv(_id);
    res.status(200).json({
      status: 200,
      message: "Xóa người dùng thành công"
    });
  } catch(err: any){
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
}

// Lấy chi tiết thông tin người dùng
export const getInfoUser = async (req: Request, res: Response) =>{
  try{
      const { _id } = req.params;
      const authenticatedUserId = req.user!.userId;
      const user = await authService.getInfoUserSv(_id, authenticatedUserId);
      res.status(200).json({
        status: 200,
        message: "Lấy thông tin người dùng thành công",
        data: user
      });
  } catch(err: any){
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
}

// Lấy danh sách user với phân trang
export const getUserList = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const search = req.query.search as string | undefined;
    
    const result = await authService.getUserListSv(page, limit, search);
    
    res.status(200).json({
      status: 200,
      message: "Lấy danh sách người dùng thành công",
      data: result
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Tạo user mới (chỉ ADMIN)
export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newUser = await authService.createUserByAdminSv(data);

    res.status(200).json({
      status: 200,
      message: "Tạo tài khoản thành công",
      data: newUser
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message
    });
  }
};
