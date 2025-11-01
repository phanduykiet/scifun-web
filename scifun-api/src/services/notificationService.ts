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

// Thông báo khi có người phản hồi bình luận của user
export const notifyCommentReply = async (params: {
  targetUserId: string; 
  fromUserName: string;  
  content: string;       
  commentId: string;     
  parentId: string;       
  persist?: boolean;      
  email?: boolean;        
}) => {
  const {
    targetUserId,
    fromUserName,
    content,
    commentId,
    parentId,
    persist = true,
    email = false,
  } = params;

  // Lưu DB (nếu cần)
  if (persist) {
    await Notification.create({
      userId: targetUserId,
      type: "COMMENT_REPLY",
      title: "Có phản hồi mới 💬",
      message: `${fromUserName} vừa trả lời bình luận của bạn: "${content}"`,
      data: { commentId, parentId },
      link: "/#comments",
    });
  }

  // 3️⃣ Gửi email text (tùy chọn)
  if (email) {
    const user = await User.findById(targetUserId);
    if (user?.email) {
      const subject = `[Quiz App] ${fromUserName} đã phản hồi bình luận của bạn`;
      const text = [
        `Xin chào ${user.fullname || "bạn"},`,
        `${fromUserName} vừa trả lời bình luận của bạn:`,
        `"${content}"`,
        `Xem phản hồi tại: ${process.env.CLIENT_URL}/#comments`,
      ].join("\n");
      await sendPlainEmail(user.email, subject, text);
    }
  }
};  