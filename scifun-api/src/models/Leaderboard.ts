import mongoose, { Schema, Document } from "mongoose";

export interface ILeaderboard extends Document {
  subjectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  subjectName: string;
  progress: number;
  averageScore: number;
  totalScore: number;
  completedQuizzes: number;
  completedTopics: number;
  rank: number;
  previousRank?: number; 
  progressCreatedAt: Date; 
  updatedAt: Date;
  period: string;
}

const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: String,
    subjectName: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
      index: true,
    },
    completedQuizzes: {
      type: Number,
      default: 0,
    },
    completedTopics: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      required: true,
      index: true,
    },
    previousRank: Number,
    progressCreatedAt: {
      type: Date,
      required: true,
    },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "alltime"],
      default: "alltime",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index cho query nhanh
LeaderboardSchema.index({ subjectId: 1, period: 1, rank: 1 });
LeaderboardSchema.index({ userId: 1, subjectId: 1, period: 1 });
LeaderboardSchema.index({ period: 1, totalScore: -1, progressCreatedAt: 1 });

export default mongoose.model<ILeaderboard>("Leaderboard", LeaderboardSchema);