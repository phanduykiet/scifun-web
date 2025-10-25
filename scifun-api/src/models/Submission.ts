import mongoose, { Schema, Document, Types } from "mongoose";
import { IQuiz } from "./Quiz";
import { IQuestion } from "./Question";

export interface ISubmission extends Document {
userId: Types.ObjectId;
quiz: Types.ObjectId | IQuiz;
answers: {
    question: Types.ObjectId | IQuestion;
    selectedAnswer: string;
    isCorrect: boolean;
}[];
score: number;
createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
userId: { type: Schema.Types.ObjectId, required: true },
quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
answers: [
    {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    },
],
score: { type: Number, required: true },
createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
