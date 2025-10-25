import mongoose, { Schema, Document, Types } from "mongoose";
import { ITopic } from "./Topic";

export interface IQuiz extends Document {
  title: string;
  description?: string;
  topic: Types.ObjectId | ITopic;
  uniqueUserCount: number;   
  lastAttemptAt?: Date;      
  favoriteCount: number;
  duration: number;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    uniqueUserCount: { type: Number, default: 0, index: true },
    lastAttemptAt: { type: Date, default: null, index: true },
    favoriteCount: { type: Number, default: 0, index: true },
    duration: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
