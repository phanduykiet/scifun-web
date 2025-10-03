import mongoose, { Schema, Document, Types } from "mongoose";
import { ITopic } from "./Topic";

export interface IQuiz extends Document {
  title: string;
  description?: string;
  topic: Types.ObjectId | ITopic;
  uniqueUserCount: number;   
  lastAttemptAt?: Date;      
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    uniqueUserCount: { type: Number, default: 0, index: true },
    lastAttemptAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
