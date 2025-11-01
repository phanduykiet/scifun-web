// src/utils/emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Gửi email thuần text, không HTML
export const sendPlainEmail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: `"Quiz App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
