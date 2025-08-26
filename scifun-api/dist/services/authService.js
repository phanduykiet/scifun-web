"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.verifyResetOtpService = exports.forgotPasswordService = exports.loginUser = exports.verifyUserOtp = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const otp_1 = require("../utils/otp");
const registerUser = async (email, password) => {
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser)
        throw new Error("Email đã tồn tại");
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const otp = (0, otp_1.generateOTP)();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    const user = new User_1.default({ email, password: hashedPassword, otp, otpExpires });
    await user.save();
    await (0, otp_1.sendMail)(email, "Mã OTP xác thực", `Mã OTP của bạn là: ${otp}`);
    return user;
};
exports.registerUser = registerUser;
const verifyUserOtp = async (email, otp) => {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error("Người dùng không tồn tại");
    if (user.otp !== otp || user.otpExpires < new Date()) {
        throw new Error("OTP không hợp lệ hoặc đã hết hạn");
    }
    user.isVerified = true;
    user.otp = "";
    await user.save();
    return user;
};
exports.verifyUserOtp = verifyUserOtp;
const loginUser = async (email, password) => {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error("Email không tồn tại");
    if (!user.isVerified)
        throw new Error("Tài khoản chưa xác thực OTP");
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Sai mật khẩu");
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1h" });
    return { token, user };
};
exports.loginUser = loginUser;
const forgotPasswordService = async (email) => {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error("Email không tồn tại");
    const otp = (0, otp_1.generateOTP)();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    await (0, otp_1.sendMail)(email, "OTP Reset mật khẩu", `Mã OTP của bạn là: ${otp}`);
    return user;
};
exports.forgotPasswordService = forgotPasswordService;
const verifyResetOtpService = async (email, otp) => {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error("Email không tồn tại");
    if (!user.otp || !user.otpExpires)
        throw new Error("OTP không hợp lệ");
    if (user.otp !== otp || new Date() > user.otpExpires) {
        throw new Error("OTP sai hoặc đã hết hạn");
    }
    return user;
};
exports.verifyResetOtpService = verifyResetOtpService;
const resetPasswordService = async (email, newPassword) => {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error("Email không tồn tại");
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    user.otp = "";
    user.otpExpires = new Date(0);
    await user.save();
    return user;
};
exports.resetPasswordService = resetPasswordService;
//# sourceMappingURL=authService.js.map