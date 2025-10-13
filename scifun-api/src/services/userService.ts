import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { generateOTP, sendMail } from "../utils/otp";

// Đăng ký với OTP
export const registerUserSv = async (email: string, password: string) => {
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
  const user = await User.findOne({ email }).select("-otp -otpExpires -__v");
  if (!user) throw new Error("Email không tồn tại");
  if (!user.isVerified) throw new Error("Tài khoản chưa xác thực OTP");
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

// Hàm kiểm tra email có đúng định dạng
const isValidEmailStrict = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Hàm kiểm tra OTP có được tạo thành công
const isOTPGenerated = (otp: string | null | undefined): boolean => {
  return otp !== null && otp !== undefined && otp.length > 0;
};

// Quên mật khẩu với OTP
export const forgotPasswordSv = async (email: string) => {
  if (!email || email.trim() === "")
    throw new Error("Email không được để trống");
  if (!isValidEmailStrict(email.trim()))
    throw new Error("Email không đúng định dạng");
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
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");
  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = "";
  user.otpExpires = new Date(0);
  await user.save();
  return user;
};

// Cập nhật thông tin người dùng
export const updateUserSv = async (_id: string, updateData: Partial<IUser>) => {
  if (!_id) throw new Error("ID người dùng không hợp lệ");
  const user = await User.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -otp -otpExpires");
  if (!user) throw new Error("Người dùng không tồn tại");
  return user;
};

// Cập nhât mật khẩu
export const updatePasswordSv = async (
  _id: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (!_id) throw new Error("ID người dùng không hợp lệ");
  if (newPassword !== confirmPassword)
    throw new Error("Mật khẩu xác nhận không khớp");
  const check = await bcrypt.compare(
    oldPassword,
    (
      await User.findById(_id)
    ).password
  );
  if (!check) throw new Error("Mật khẩu cũ không đúng");
  await User.updateMany(
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
export const getInfoUserSv = async (_id: string) => {
  if (!_id) throw new Error("ID người dùng không hợp lệ");
  const infoUser = await User.findById(_id).select(
    "-otp -otpExpires -isVerified"
  );
  if (!infoUser) throw new Error("Người dùng không tồn tại");
  return infoUser;
};
