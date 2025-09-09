import mongoose, { Schema, Document, Types } from "mongoose";
import { ITopic } from "./Topic";
import e from "express";

export interface IQuiz extends Document {
  title: string;
  description?: string;
  topic: Types.ObjectId | ITopic;
}

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String },
  topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true }
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
