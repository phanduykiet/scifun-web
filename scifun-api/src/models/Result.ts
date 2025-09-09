import mongoose, { Schema, Document, Types } from "mongoose";
import { IQuiz } from "./Quiz";
import e from "express";

export interface IResult extends Document {
  userId: string; // hoặc ObjectId nếu có User model
  quiz: Types.ObjectId | IQuiz;
  score: number;
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  userId: { type: String, required: true },
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResult>("Result", ResultSchema);
