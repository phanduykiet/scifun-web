import mongoose, { Schema, Document, Types } from "mongoose";
import { IQuiz } from "./Quiz";

export interface IResult extends Document {
  userId: string;
  quiz: Types.ObjectId | IQuiz;
  bestScore: number;
  attempts: number;        // số lần làm quiz
  averageScore: number;    // điểm trung bình
  lastSubmissionAt: Date;  // lần nộp gần nhất
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  userId: { type: String, required: true },
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  bestScore: { type: Number, required: true },
  attempts: { type: Number, required: true, default: 0 },
  averageScore: { type: Number, required: true, default: 0 },
  lastSubmissionAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResult>("Result", ResultSchema);
