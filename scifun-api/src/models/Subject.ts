import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description?: string;
  maxTopics?: number;
}

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  description: { type: String },
  maxTopics: { type: Number, default: 20 }
});

export default mongoose.model<ISubject>("Subject", SubjectSchema);
