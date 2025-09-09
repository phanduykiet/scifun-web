import mongoose, { Schema, Document, Types } from "mongoose";
import { ITopic } from "./Topic";

export interface IVideoLesson extends Document {
  title: string;
  url: string;
  duration?: number; // in seconds
  topic: Types.ObjectId | ITopic;
}

const VideoLessonSchema = new Schema<IVideoLesson>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: Number },
  topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true }
});

export default mongoose.model<IVideoLesson>("VideoLesson", VideoLessonSchema);
