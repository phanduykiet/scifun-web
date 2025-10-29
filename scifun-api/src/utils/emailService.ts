// src/utils/emailService.ts
import nodemailer from "nodemailer";

// Tạo transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Gửi email notification chung
export const sendEmailNotification = async (
  to: string,
  title: string,
  message: string,
  link?: string
) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h2>${title}</h2></div>
          <div class="content">
            <p>${message}</p>
            ${link ? `<a href="${link}" class="button">Xem chi tiết</a>` : ""}
          </div>
          <div class="footer">
            <p>© 2025 Quiz App. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Quiz App" <${process.env.EMAIL_USER}>`,
      to,
      subject: title,
      html: htmlContent,
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Gửi welcome email
export const sendWelcomeEmail = async (to: string, userName: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2>Chào mừng đến với Quiz App! 🎉</h2></div>
        <div class="content">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Quiz App!</p>
          <p>Hãy bắt đầu hành trình học tập của bạn ngay hôm nay.</p>
          <a href="${process.env.CLIENT_URL}/dashboard" class="button">Bắt đầu học</a>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Quiz App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Chào mừng đến với Quiz App!",
    html: htmlContent,
  });
};