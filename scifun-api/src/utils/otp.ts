import nodemailer from "nodemailer";

//Tạo mã OTP gồm 6 số
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
};

// Gửi OTP qua Mail
export const sendMail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({ from: `"SciFun " <${process.env.EMAIL_USER}>`, to, subject, text });
};