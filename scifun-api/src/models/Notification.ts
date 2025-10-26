// models/Notification.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: 
    | "NEW_QUIZ"           // Quiz mới
    | "QUIZ_COMPLETED"     // Hoàn thành quiz
    | "ACHIEVEMENT"        // Thành tích
    | "RANK_CHANGE"        // Thay đổi xếp hạng
    | "MILESTONE"          // Hoàn thành milestone
    | "REMINDER"           // Nhắc nhở
    | "NEW_USER"           // User mới (admin)
    | "SUPPORT_MESSAGE"    // Tin nhắn hỗ trợ (admin)
    | "QUIZ_REPORT"        // Báo cáo quiz (admin)
    | "COMMENT_REPLY"      // Trả lời comment
    | "WEEKLY_REPORT";     // Báo cáo tuần
  title: string;
  message: string;
  data?: any; // Dữ liệu bổ sung (quiz ID, result ID...)
  link?: string; // Link đến trang liên quan
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      "NEW_QUIZ",
      "QUIZ_COMPLETED",
      "ACHIEVEMENT",
      "RANK_CHANGE",
      "MILESTONE",
      "REMINDER",
      "NEW_USER",
      "SUPPORT_MESSAGE",
      "QUIZ_REPORT",
      "COMMENT_REPLY",
      "WEEKLY_REPORT"
    ]
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  link: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Index để query nhanh
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);