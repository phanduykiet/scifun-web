import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description?: string;
  maxTopics?: number;
  image?: string;
}

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  description: { type: String },
  maxTopics: { type: Number, default: 20 },
  image: { type: String, default: "https://res.cloudinary.com/dglm2f7sr/image/upload/v1761400287/default_gdfbhs.png" }
});

export default mongoose.model<ISubject>("Subject", SubjectSchema);
