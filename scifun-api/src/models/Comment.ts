// src/models/Comment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  content: string;
  parentId?: mongoose.Types.ObjectId | null; // null = comment gốc
  repliesCount: number;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userAvatar: String,
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    repliesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CommentSchema.index({ parentId: 1, createdAt: -1 });

export default mongoose.model<IComment>("Comment", CommentSchema);
