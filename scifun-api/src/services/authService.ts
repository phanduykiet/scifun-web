import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateOTP, sendMail } from "../utils/otp";

export const registerUser = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email đã tồn tại");

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const user = new User({ email, password: hashedPassword, otp, otpExpires });
  await user.save();

  await sendMail(email, "Mã OTP xác thực", `Mã OTP của bạn là: ${otp}`);
  return user;
};

export const verifyUserOtp = async (email: string, otp: string) => {
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

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");
  if (!user.isVerified) throw new Error("Tài khoản chưa xác thực OTP");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu");

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: (process.env.JWT_EXPIRES as string) || "1h",
    } as jwt.SignOptions
  );

  return { token, user };
};
