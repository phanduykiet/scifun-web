// models/UserProgress.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface IQuizProgress {
  quizId: Types.ObjectId;
  name: string;
  score: number | null; // null = chưa làm
  bestScore: number;
  attempts: number;
  lastSubmissionAt: Date | null;
}

interface ITopicProgress {
  topicId: Types.ObjectId;
  name: string;
  progress: number; // % hoàn thành topic (0-100)
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  quizzes: IQuizProgress[];
}

export interface IUserProgress extends Document {
  userId: Types.ObjectId;
  subjectId: Types.ObjectId;
  subjectName: string;
  progress: number; // % hoàn thành subject (0-100)
  totalTopics: number;
  completedTopics: number; // topics có progress = 100%
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number; // điểm trung bình toàn subject
  topics: ITopicProgress[];
  lastUpdatedAt: Date;
}

const QuizProgressSchema = new Schema<IQuizProgress>({
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  name: { type: String, required: true },
  score: { type: Number, default: null },
  bestScore: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  lastSubmissionAt: { type: Date, default: null }
}, { _id: false });

const TopicProgressSchema = new Schema<ITopicProgress>({
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  name: { type: String, required: true },
  progress: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  completedQuizzes: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  quizzes: [QuizProgressSchema]
}, { _id: false });

const UserProgressSchema = new Schema<IUserProgress>({
  userId: { type: Schema.Types.ObjectId, required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  subjectName: { type: String, required: true },
  progress: { type: Number, default: 0 },
  totalTopics: { type: Number, default: 0 },
  completedTopics: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  completedQuizzes: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  topics: [TopicProgressSchema],
  lastUpdatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index để tăng tốc query
UserProgressSchema.index({ userId: 1, subjectId: 1 }, { unique: true });

export default mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);