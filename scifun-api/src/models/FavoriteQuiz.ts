// models/FavoriteQuiz.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFavoriteQuiz extends Document {
  user: Types.ObjectId;
  quiz: Types.ObjectId;
  createdAt: Date;
}

const FavoriteQuizSchema = new Schema<IFavoriteQuiz>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    quiz: { 
      type: Schema.Types.ObjectId, 
      ref: "Quiz", 
      required: true,
      index: true 
    }
  },
  { timestamps: true }
);

FavoriteQuizSchema.index({ user: 1, quiz: 1 }, { unique: true });

export default mongoose.model<IFavoriteQuiz>("FavoriteQuiz", FavoriteQuizSchema);