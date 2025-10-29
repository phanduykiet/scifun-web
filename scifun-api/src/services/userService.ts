import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { generateOTP, sendMail } from "../utils/otp";
import { notifyWelcome, notifyAdminNewUser } from "./notificationService";

// Đăng ký với OTP
export const registerUserSv = async (infoUser: Partial<IUser>) => {
  // Validate email
  const { email, password, fullname } = infoUser;
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
      fullname,
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
export const verifyUserOtpSv = async (email: string, otp: string) => {;
  // Tìm user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Người dùng không tồn tại");
  if (user.otp !== otp || user.otpExpires < new Date()) {
    throw new Error("OTP không hợp lệ hoặc đã hết hạn");
  }
  user.isVerified = true;
  user.otp = "";
  await user.save();
  // ✅ Gửi notification chào mừng
  await notifyWelcome(user._id.toString(), user.fullname, user.email);

  // ✅ Thông báo cho admin
  await notifyAdminNewUser(user.fullname, user.email);
  return user;
};

// Đăng nhập với JWT
export const loginUserSv = async (email: string, password: string) => {
  // Tìm user
  const user = await User.findOne({ email }).select("-otp -otpExpires -__v");
  if (!user) throw new Error("Email không tồn tại");
  if (!user.isVerified) throw new Error("Tài khoản chưa xác thực OTP");
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
  // Tìm user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();
  await sendMail(email, "OTP Reset mật khẩu", `Mã OTP của bạn là: ${otp}`);
  return user;
};

// Xác thực OTP để đặt lại mật khẩu
export const verifyResetOtpSv = async (email: string, otp: string) => {
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
  // Chỉ cho phép người dùng lấy thông tin của chính họ
  if (_id !== authenticatedUserId) {
    throw new Error("Bạn không có quyền truy cập thông tin này");
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
  // Chỉ cho phép người dùng lấy thông tin của chính họ
  if (_id !== authenticatedUserId) {
    throw new Error("Bạn không có quyền truy cập thông tin này");
  }
  const infoUser = await User.findById(_id).select(
    "-otp -otpExpires -isVerified -password -__v"
  );
  if (!infoUser) throw new Error("Người dùng không tồn tại");
  return infoUser;
};

// Lấy danh sách người dùng với phân trang + tìm kiếm theo email hoặc fullname
export const getUserListSv = async (
  page?: number,
  limit?: number,
  search?: string
) => {
  try {
    // Nếu không truyền page và limit thì lấy tất cả
    if (!page || !limit) {
      const query: any = {};
      
      // Nếu có search thì tìm theo email hoặc fullname
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: "i" } },
          { fullname: { $regex: search, $options: "i" } }
        ];
      }
      
      const users = await User.find(query)
        .select("-password -otp -otpExpires")
        .sort({ createdAt: -1 });
      
      return {
        users,
        total: users.length,
        page: 1,
        limit: users.length,
        totalPages: 1
      };
    }
    
    // Nếu có page và limit thì phân trang
    const skip = (page - 1) * limit;
    const query: any = {};
    
    // Nếu có search thì tìm theo email hoặc fullname
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { fullname: { $regex: search, $options: "i" } }
      ];
    }
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -otp -otpExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);
    
    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error: any) {
    throw new Error(error.message || "Lỗi lấy danh sách người dùng");
  }
};

// Service thêm user mới bởi ADMIN
export const createUserByAdminSv = async (userData: Partial<IUser>) => {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email đã tồn tại trong hệ thống");
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  // Tạo user mới với isVerified = true (vì admin tạo)
  const newUser = await User.create({
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    isVerified: true, // Tự động verify
    otp: "", 
    otpExpires: ""
  });

  return newUser;
};
