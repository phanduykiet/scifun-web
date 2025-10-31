import mongoose, { Schema, Document, Types } from "mongoose";
import { ITopic } from "./Topic";

export type AccessTier = "FREE" | "PRO";

export interface IQuiz extends Document {
  title: string;
  description?: string;
  topic: Types.ObjectId | ITopic;
  uniqueUserCount: number;
  lastAttemptAt?: Date;
  favoriteCount: number;
  duration: number;
  questionCount: number;

  accessTier: AccessTier; // FREE hoặc PRO
  isLocked?: boolean;     // virtual
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },

    uniqueUserCount: { type: Number, default: 0, index: true },
    lastAttemptAt: { type: Date, default: null, index: true },
    favoriteCount: { type: Number, default: 0, index: true },

    duration: { type: Number, required: true, min: 1 },
    questionCount: { type: Number, default: 0, min: 0 },

    // Đánh dấu bài thuộc FREE / PRO
    accessTier: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
      index: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field (không lưu trong DB)
QuizSchema.virtual("isLocked").get(function (this: IQuiz) {
  return this.accessTier !== "FREE";
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
