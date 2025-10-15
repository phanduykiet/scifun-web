import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { generateOTP, sendMail } from "../utils/otp";

// Hàm kiểm tra định dạng mật khẩu
const validatePasswordFormat = (password: string): { isValid: boolean; message: string } => {
  // Kiểm tra null, undefined, kiểu dữ liệu
  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    return { isValid: false, message: "Mật khẩu không được để trống" };
  }
  // Kiểm tra độ dài (> 5 ký tự)
  if (password.length < 5) {
    return { isValid: false, message: "Mật khẩu phải có nhiều hơn 5 ký tự" };
  }
  // Kiểm tra có ít nhất 1 chữ hoa
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 1 chữ hoa" };
  }
  // Kiểm tra có ít nhất 1 chữ thường
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 1 chữ thường" };
  }
  // Kiểm tra có ít nhất 1 số
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 1 số" };
  }
  // Kiểm tra có ít nhất 1 ký tự đặc biệt
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt" };
  }
  
  return { isValid: true, message: "Mật khẩu hợp lệ" };
};

// Hàm kiểm tra email có đúng định dạng
const isValidEmailStrict = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Hàm kiểm tra OTP có được tạo thành công
const isOTPGenerated = (otp: string | null | undefined): boolean => {
  return otp !== null && otp !== undefined && otp.length > 0;
};

// Đăng ký với OTP
export const registerUserSv = async (email: string, password: string) => {
  // Validate email
  if (!email || email.trim() === "")
    throw new Error("Email không được để trống");
  if (!isValidEmailStrict(email.trim()))
    throw new Error("Email không đúng định dạng");
  // Validate định dạng mật khẩu
  const PasswordValidation = validatePasswordFormat(password);
  if (!PasswordValidation.isValid) {
    throw new Error(`Mật khẩu không hợp lệ: ${PasswordValidation.message}`);
  }
  // Tìm user
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new Error("Email đã được sử dụng, vui lòng đăng nhập");
    }
    existingUser.password = await bcrypt.hash(password, 10);
    existingUser.otp = generateOTP();
    existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser = new User({
      email,
      password: hashedPassword,
      otp: generateOTP(),
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
    });
  }
  await sendMail(
    email,
    "OTP xác thực đăng ký",
    `Mã OTP của bạn là: ${existingUser.otp}`
  );
  await existingUser.save();
};

// Xác thực OTP
export const verifyUserOtpSv = async (email: string, otp: string) => {
  // Validate email
  if (!email || email.trim() === "")
    throw new Error("Email không được để trống");
  if (!isValidEmailStrict(email.trim()))
    throw new Error("Email không đúng định dạng");
  // Tìm user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Người dùng không tồn tại");
  if (user.otp !== otp || user.otpExpires < new Date()) {
    throw new Error("OTP không hợp lệ hoặc đã hết hạn");
  }
  user.isVerified = true;
  user.otp = "";
  await user.save();
  return user;
};

// Đăng nhập với JWT
export const loginUserSv = async (email: string, password: string) => {
  // Validate email
  if (!email || email.trim() === "")
    throw new Error("Email không được để trống");
  if (!isValidEmailStrict(email.trim()))
    throw new Error("Email không đúng định dạng");
  // Tìm user
  const user = await User.findOne({ email }).select("-otp -otpExpires -__v");
  if (!user) throw new Error("Email không tồn tại");
  if (!user.isVerified) throw new Error("Tài khoản chưa xác thực OTP");
  // Validate định dạng mật khẩu
  const PasswordValidation = validatePasswordFormat(password);
  if (!PasswordValidation.isValid) {
    throw new Error(`Mật khẩu không hợp lệ: ${PasswordValidation.message}`);
  }
  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu");
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: (process.env.JWT_EXPIRES as string) || "1h",
    } as jwt.SignOptions
  );
  return { token, user };
};

// Quên mật khẩu với OTP
export const forgotPasswordSv = async (email: string) => {
  // Validate email
  if (!email || email.trim() === "")
    throw new Error("Email không được để trống");
  if (!isValidEmailStrict(email.trim()))
    throw new Error("Email không đúng định dạng");
  // Tìm user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");
  const otp = generateOTP();
  if (!isOTPGenerated(otp))
    throw new Error("Không thể tạo mã OTP. Vui lòng thử lại sau");
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();
  await sendMail(email, "OTP Reset mật khẩu", `Mã OTP của bạn là: ${otp}`);
  return user;
};

// Xác thực OTP để đặt lại mật khẩu
export const verifyResetOtpSv = async (email: string, otp: string) => {
  // Validate email
  if (!email || email.trim() === "")
    throw new Error("Email không được để trống");
  if (!isValidEmailStrict(email.trim()))
    throw new Error("Email không đúng định dạng");
  // Tìm user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");
  if (!user.otp || !user.otpExpires) throw new Error("OTP không hợp lệ");
  if (user.otp !== otp || new Date() > user.otpExpires) {
    throw new Error("OTP sai hoặc đã hết hạn");
  }
  return user;
};

// Đặt lại mật khẩu (Khi quên mật khẩu)
export const resetPasswordSv = async (email: string, newPassword: string) => {
  // Validate email
  if (!email || email.trim() === "")
    throw new Error("Email không được để trống");
  if (!isValidEmailStrict(email.trim()))
    throw new Error("Email không đúng định dạng");
  // Validate định dạng mật khẩu
  const PasswordValidation = validatePasswordFormat(newPassword);
  if (!PasswordValidation.isValid) {
    throw new Error(`Mật khẩu không hợp lệ: ${PasswordValidation.message}`);
  }
  // Tìm user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");
  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = "";
  user.otpExpires = new Date(0);
  await user.save();
  return user;
};

// Cập nhật thông tin người dùng
export const updateUserSv = async (_id: string, updateData: Partial<IUser>, authenticatedUserId: string) => {
  // Validate _id không rỗng
  if (!_id || typeof _id !== 'string' || _id.trim().length === 0) {
    throw new Error("ID người dùng không hợp lệ");
  }
  // Chỉ cho phép người dùng lấy thông tin của chính họ
  if (_id !== authenticatedUserId) {
    throw new Error("Bạn không có quyền truy cập thông tin này");
  }
  // Validate _id có đúng định dạng ObjectId của MongoDB (24 ký tự hex)
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    throw new Error("ID người dùng không đúng định dạng");
  }
  const user = await User.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -otp -otpExpires");
  if (!user) throw new Error("Người dùng không tồn tại");
  return user;
};

// Cập nhật mật khẩu 
export const updatePasswordSv = async ( 
  _id: string, 
  oldPassword: string, 
  newPassword: string, 
  confirmPassword: string 
) => { 
  // Validate ID
  if (!_id) throw new Error("ID người dùng không hợp lệ"); 
  // Validate định dạng mật khẩu cũ
  const oldPasswordValidation = validatePasswordFormat(oldPassword);
  if (!oldPasswordValidation.isValid) {
    throw new Error(`Mật khẩu cũ không hợp lệ: ${oldPasswordValidation.message}`);
  }
  // Validate định dạng mật khẩu mới
  const newPasswordValidation = validatePasswordFormat(newPassword);
  if (!newPasswordValidation.isValid) {
    throw new Error(`Mật khẩu mới không hợp lệ: ${newPasswordValidation.message}`);
  }
  // Validate định dạng mật khẩu xác nhận
  const confirmPasswordValidation = validatePasswordFormat(confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    throw new Error(`Mật khẩu xác nhận không hợp lệ: ${confirmPasswordValidation.message}`);
  }
  // Validate mật khẩu xác nhận khớp
  if (newPassword !== confirmPassword) {
    throw new Error("Mật khẩu xác nhận không khớp"); 
  }
  // Kiểm tra mật khẩu cũ
  const user = await User.findById(_id);
  if (!user) throw new Error("Không tìm thấy người dùng");
  const check = await bcrypt.compare(oldPassword, user.password); 
  if (!check) throw new Error("Mật khẩu cũ không đúng"); 
  // Cập nhật mật khẩu mới
  await User.updateOne( 
    { _id }, 
    { $set: { password: await bcrypt.hash(newPassword, 10) } }, 
    { runValidators: true } 
  ); 
};

// Xoá người dùng
export const deleteUserSv = async (userId: string) => {
  if (!userId) throw new Error("ID người dùng không hợp lệ");
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("Người dùng không tồn tại");
};

// Lấy chi tiết thông tin người dùng
export const getInfoUserSv = async (_id: string, authenticatedUserId: string) => {
  // Validate _id không rỗng
  if (!_id || typeof _id !== 'string' || _id.trim().length === 0) {
    throw new Error("ID người dùng không hợp lệ");
  }
  // Chỉ cho phép người dùng lấy thông tin của chính họ
  if (_id !== authenticatedUserId) {
    throw new Error("Bạn không có quyền truy cập thông tin này");
  }
  // Validate _id có đúng định dạng ObjectId của MongoDB (24 ký tự hex)
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    throw new Error("ID người dùng không đúng định dạng");
  }
  const infoUser = await User.findById(_id).select(
    "-otp -otpExpires -isVerified"
  );
  if (!infoUser) throw new Error("Người dùng không tồn tại");
  return infoUser;
};
