// src/models/Plan.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;          // "Gói Tuần", "Gói Tháng"
  price: number;         // 99000, 279000 (VND)
  durationDays: number;  // 7, 30
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPlan>("Plan", PlanSchema);
