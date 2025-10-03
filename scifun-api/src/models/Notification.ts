import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: "QUIZ" | "SUBJECT" | "TOPIC" | "USER" | "SCORE" | "ACCOUNT" | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  relatedId?: Types.ObjectId;
  relatedModel?: string; // "Quiz", "Subject", "Topic", "User"
  metadata?: {
    quizId?: string;
    subjectId?: string;
    topicId?: string;
    score?: number;
    userName?: string;
    [key: string]: any;
  };
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["QUIZ", "SUBJECT", "TOPIC", "USER", "SCORE", "ACCOUNT", "SYSTEM"],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  relatedId: { type: Schema.Types.ObjectId },
  relatedModel: { type: String },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);