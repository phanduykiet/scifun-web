// src/services/notificationService.ts
import Notification from "../models/Notification";
import User from "../models/User";
import UserProgress from "../models/UserProgress";
import { emitToUser, emitToAdmins } from "./socketService";
import { sendEmailNotification, sendWelcomeEmail } from "../utils/emailService";

// ========== HELPER: Tạo notification ==========
const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  options?: {
    data?: any;
    link?: string;
    sendEmail?: boolean;
  }
) => {
  // Lưu vào DB
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    data: options?.data,
    link: options?.link,
    isRead: false
  });

  // Gửi realtime qua WebSocket
  emitToUser(userId, "notification:new", notification);

  // Gửi email (nếu cần)
  if (options?.sendEmail) {
    try {
      const user = await User.findById(userId);
      if (user?.email) {
        const fullLink = options.link 
          ? `${process.env.CLIENT_URL}${options.link}` 
          : undefined;
        await sendEmailNotification(user.email, title, message, fullLink);
      }
    } catch (error) {
      console.error("⚠️ Email error:", error);
    }
  }

  return notification;
};

// ========== 1. ĐĂNG KÝ THÀNH CÔNG ==========
export const notifyWelcome = async (
  userId: string, 
  userName: string, 
  userEmail: string
) => {
  await createNotification(
    userId,
    "WELCOME",
    "Chào mừng đến với Quiz App! 🎉",
    `Xin chào ${userName}, bạn đã đăng ký thành công. Hãy bắt đầu hành trình học tập!`,
    {
      link: "/dashboard",
      sendEmail: false // Welcome email sẽ gửi riêng
    }
  );
  

  // Gửi welcome email riêng
  try {
    await sendWelcomeEmail(userEmail, userName);
  } catch (error) {
    console.error("⚠️ Welcome email error:", error);
  }
};

// ========== 2. QUIZ MỚI ==========
export const notifyNewQuiz = async (
  quizId: string,
  quizTitle: string,
  topicId: string
) => {
  try {
    const progresses = await UserProgress.find({
      "topics.topicId": topicId
    });

    for (const progress of progresses) {
      await createNotification(
        progress.userId.toString(),
        "NEW_QUIZ",
        "Quiz mới! 📝",
        `Quiz "${quizTitle}" vừa được thêm vào chủ đề bạn đang học`,
        {
          data: { quizId, topicId },
          link: `/quizzes/${quizId}`,
          sendEmail: false
        }
      );
    }
  } catch (error) {
    console.error("⚠️ Notify new quiz error:", error);
  }
};

// ========== 3. TOPIC MỚI ==========
export const notifyNewTopic = async (
  topicId: string,
  topicName: string,
  subjectId: string
) => {
  try {
    const progresses = await UserProgress.find({ subjectId });

    for (const progress of progresses) {
      await createNotification(
        progress.userId.toString(),
        "NEW_TOPIC",
        "Chủ đề mới! 📚",
        `Chủ đề "${topicName}" vừa được thêm vào môn học bạn đang học`,
        {
          data: { topicId, subjectId },
          link: `/topics/${topicId}`,
          sendEmail: false
        }
      );
    }
    
  } catch (error) {
    console.error("⚠️ Notify new topic error:", error);
  }
};

// ========== 4. HOÀN THÀNH QUIZ ==========
export const notifyQuizCompleted = async (
  userId: string,
  quizTitle: string,
  score: number,
  resultId: string
) => {
  await createNotification(
    userId,
    "QUIZ_COMPLETED",
    "Hoàn thành quiz! ✅",
    `Bạn đã đạt ${score.toFixed(1)} điểm trong quiz "${quizTitle}"`,
    {
      data: { resultId, score },
      link: `/results/${resultId}`,
      sendEmail: true
    }
  );
};

// ========== 5. HOÀN THÀNH TOPIC (100%) ==========
export const notifyTopicCompleted = async (
  userId: string,
  topicName: string,
  subjectName: string
) => {
  await createNotification(
    userId,
    "TOPIC_COMPLETED",
    "Hoàn thành chủ đề! 🎉",
    `Chúc mừng! Bạn đã hoàn thành 100% chủ đề "${topicName}" trong môn ${subjectName}`,
    {
      link: "/progress",
      sendEmail: true
    }
  );
};

// ========== 6. HOÀN THÀNH SUBJECT (100%) ==========
export const notifySubjectCompleted = async (
  userId: string,
  subjectName: string
) => {
  await createNotification(
    userId,
    "SUBJECT_COMPLETED",
    "Hoàn thành môn học! 🏆",
    `Xuất sắc! Bạn đã hoàn thành 100% môn ${subjectName}`,
    {
      link: "/progress",
      sendEmail: true
    }
  );
};

// ========== 7. THĂNG HẠNG ==========
export const notifyRankChanged = async (
  userId: string,
  oldRank: number,
  newRank: number,
  change: "up" | "down"
) => {
  const emoji = change === "up" ? "📈" : "📉";
  const action = change === "up" ? "tăng" : "giảm";
  const diff = Math.abs(newRank - oldRank);

  await createNotification(
    userId,
    "RANK_CHANGED",
    `Thay đổi xếp hạng ${emoji}`,
    `Bạn đã ${action} ${diff} hạng (từ #${oldRank} → #${newRank})`,
    {
      data: { oldRank, newRank, change },
      link: "/leaderboard",
      sendEmail: true
    }
  );
};

// ========== 8. ĐIỂM CAO MỚI ==========
export const notifyNewBestScore = async (
  userId: string,
  quizTitle: string,
  oldScore: number,
  newScore: number
) => {
  await createNotification(
    userId,
    "NEW_BEST_SCORE",
    "Điểm cao mới! ⭐",
    `Bạn đã phá kỷ lục trong quiz "${quizTitle}": ${oldScore.toFixed(1)} → ${newScore.toFixed(1)} điểm`,
    {
      data: { oldScore, newScore },
      link: "/profile",
      sendEmail: false
    }
  );
};

// ========== 9. USER MỚI (CHO ADMIN) ==========
export const notifyAdminNewUser = async (
  userName: string, 
  userEmail: string
) => {
  try {
    const admins = await User.find({ role: "ADMIN" });

    for (const admin of admins) {
      await createNotification(
        admin._id.toString(),
        "NEW_USER",
        "Người dùng mới 👤",
        `${userName} (${userEmail}) vừa đăng ký`,
        {
          data: { userEmail },
          link: "/admin/users",
          sendEmail: false
        }
      );
    }

    // Emit realtime đến tất cả admin
    emitToAdmins("notification:new", {
      type: "NEW_USER",
      title: "Người dùng mới 👤",
      message: `${userName} (${userEmail}) vừa đăng ký`
    });
  } catch (error) {
    console.error("⚠️ Notify admin error:", error);
  }
};

// ========== UTILITY FUNCTIONS ==========

// Lấy danh sách notification
export const getUserNotificationsSv = async (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ userId }),
    Notification.countDocuments({ userId, isRead: false })
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

// Đánh dấu đã đọc
export const markAsReadSv = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) throw new Error("Notification không tồn tại");
  return notification;
};

// Đánh dấu tất cả đã đọc
export const markAllAsReadSv = async (userId: string) => {
  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

// Xóa notification
export const deleteNotificationSv = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId
  });

  if (!notification) throw new Error("Notification không tồn tại");
  return notification;
};

// Đếm số notification chưa đọc
export const getUnreadCountSv = async (userId: string) => {
  const unreadCount = await Notification.countDocuments({ 
    userId, 
    isRead: false 
  });
  return unreadCount;
};

// Xóa tất cả notification đã đọc
export const deleteAllReadSv = async (userId: string) => {
  await Notification.deleteMany({ 
    userId, 
    isRead: true 
  });
};