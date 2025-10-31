// src/services/notificationService.ts
import Notification from "../models/Notification";
import User from "../models/User";
import { emitRankChangeToUser } from "./socketService";
import { sendPlainEmail } from "../utils/emailService";

// Chỉ 1 chức năng: thông báo khi thứ hạng thay đổi
export const notifyRankChanged = async (params: {
  userId: string;
  subjectId: string;
  subjectName: string;
  period: "daily" | "weekly" | "monthly" | "alltime";
  oldRank: number;
  newRank: number;
  persist?: boolean;   // mặc định true: lưu DB
  email?: boolean;     // mặc định true: gửi email text
}) => {
  const {
    userId,
    subjectId,
    subjectName,
    period,
    oldRank,
    newRank,
    persist = true,
    email = true,
  } = params;

  if (oldRank === newRank) return; // không đổi thì thôi

  const change: "up" | "down" = newRank < oldRank ? "up" : "down";
  const diff = Math.abs(newRank - oldRank);

  // 1) Realtime qua WS
  emitRankChangeToUser(userId, {
    subjectId: subjectId.toString(),
    subjectName,
    period,
    oldRank,
    newRank,
    change,
  });

  // 2) Lưu DB (tối giản)
  if (persist) {
    await Notification.create({
      userId,
      type: "RANK_CHANGED",
      title: "Thay đổi xếp hạng",
      message:
        change === "up"
          ? `Bạn đã tăng ${diff} hạng (từ #${oldRank} → #${newRank})`
          : `Bạn đã giảm ${diff} hạng (từ #${oldRank} → #${newRank})`,
      data: { subjectId, subjectName, period, oldRank, newRank, change },
      link: "/leaderboard",
    });
  }

  // 3) Email thuần text
  if (email) {
    const user = await User.findById(userId);
    if (user?.email) {
      const subject = `[Quiz App] Thứ hạng của bạn đã ${change === "up" ? "tăng" : "giảm"}`;
      const textLines = [
        `Xin chào ${user.email || "bạn"},`,
        `Thứ hạng môn ${subjectName} (${period}) của bạn đã ${change === "up" ? "tăng" : "giảm"} ${diff} bậc: #${oldRank} → #${newRank}.`,
        `Xem bảng xếp hạng: ${process.env.CLIENT_URL}/leaderboard`,
      ];
      await sendPlainEmail(user.email, subject, textLines.join("\n"));
    }
  }
};
