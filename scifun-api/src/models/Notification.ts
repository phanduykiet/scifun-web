// src/models/Notification.ts
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: 
    | "WELCOME"              // Đăng ký thành công
    | "NEW_QUIZ"            // Quiz mới
    | "NEW_TOPIC"           // Topic mới
    | "QUIZ_COMPLETED"      // Hoàn thành quiz
    | "TOPIC_COMPLETED"     // Hoàn thành topic 100%
    | "SUBJECT_COMPLETED"   // Hoàn thành subject 100%
    | "RANK_CHANGED"        // Thay đổi xếp hạng
    | "NEW_BEST_SCORE"      // Điểm cao mới
    | "LEARNING_REMINDER"   // Nhắc nhở học
    | "WEEKLY_REPORT"       // Báo cáo tuần
    | "NEW_USER"            // User mới (admin)
    | "DAILY_REPORT";       // Báo cáo ngày (admin)
  title: string;
  message: string;
  data?: any;              // Dữ liệu bổ sung (JSON)
  link?: string;           // Link đến trang liên quan
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: [
      "WELCOME",
      "NEW_QUIZ",
      "NEW_TOPIC",
      "QUIZ_COMPLETED",
      "TOPIC_COMPLETED",
      "SUBJECT_COMPLETED",
      "RANK_CHANGED",
      "NEW_BEST_SCORE",
      "LEARNING_REMINDER",
      "WEEKLY_REPORT",
      "NEW_USER",
      "DAILY_REPORT"
    ]
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  data: { 
    type: Schema.Types.Mixed 
  },
  link: { 
    type: String 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes để tăng tốc query
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);