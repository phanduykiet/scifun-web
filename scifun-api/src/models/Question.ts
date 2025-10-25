import mongoose, { Schema, Document, Types } from "mongoose";
import { IQuiz } from "./Quiz";

export interface IAnswer {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion extends Document {
  text: string;
  quiz: Types.ObjectId | IQuiz;
  answers: IAnswer[];
  explanation?: string;
}

const AnswerSchema = new Schema<IAnswer>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [AnswerSchema],
  explanation: { type: String }
});

export default mongoose.model<IQuestion>("Question", QuestionSchema);