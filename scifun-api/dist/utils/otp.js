"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.generateOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const sendMail = async (to, subject, text) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({ from: `"SciFun " <${process.env.EMAIL_USER}>`, to, subject, text });
};
exports.sendMail = sendMail;
//# sourceMappingURL=otp.js.map