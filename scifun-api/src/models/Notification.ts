import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: "RANK_CHANGED" | "COMMENT_REPLY";  // ← thêm loại mới
  title: string;
  message: string;
  data?: any;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },

    type: {
      type: String,
      required: true,
      enum: ["RANK_CHANGED", "COMMENT_REPLY"], // ← thêm COMMENT_REPLY
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    data: { type: Schema.Types.Mixed },
    link: { type: String },

    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// Indexes để tối ưu query
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);
