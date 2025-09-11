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
  image: { type: String, default: "https://images-na.ssl-images-amazon.com/images/I/51T8OXMiB5L._SX329_BO1,204,203,200_.jpg" }
});

export default mongoose.model<ISubject>("Subject", SubjectSchema);
