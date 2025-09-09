import mongoose, { Schema, Document, Types } from "mongoose";
import { ISubject } from "./Subject";

export interface ITopic extends Document {
  name: string;
  description?: string;
  subject: Types.ObjectId | ISubject;
}

const TopicSchema = new Schema<ITopic>({
  name: { type: String, required: true },
  description: { type: String },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true }
});

export default mongoose.model<ITopic>("Topic", TopicSchema);