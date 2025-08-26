"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetOtp = exports.forgotPassword = exports.login = exports.verifyOTP = exports.register = void 0;
const authService = __importStar(require("../services/authService"));
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        await authService.registerUser(email, password);
        res.json({
            message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy OTP.",
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.register = register;
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await authService.verifyUserOtp(email, otp);
        res.json({ message: "Xác thực thành công" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.verifyOTP = verifyOTP;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token } = await authService.loginUser(email, password);
        res.json({ message: "Đăng nhập thành công", token });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await authService.forgotPasswordService(email);
        res.json({ message: "OTP đã được gửi đến email" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.forgotPassword = forgotPassword;
const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await authService.verifyResetOtpService(email, otp);
        res.json({ message: "OTP hợp lệ, bạn có thể đổi mật khẩu" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.verifyResetOtp = verifyResetOtp;
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        await authService.resetPasswordService(email, newPassword);
        res.json({ message: "Mật khẩu đã được cập nhật" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map