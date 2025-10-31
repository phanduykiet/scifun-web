import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;
  type: "SUBSCRIPTION";
  total: number;
  currency: "VND";
  provider: "ZALOPAY";
  providerRef: string;                 
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  planTier: "PRO";
  period: "month";
  currentPeriodEnd?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // Đặt default để không còn lỗi "Path `type` is required"
    type: { type: String, enum: ["SUBSCRIPTION"], default: "SUBSCRIPTION" },

    total: { type: Number, required: true },
    currency: { type: String, enum: ["VND"], default: "VND" },

    provider: { type: String, enum: ["ZALOPAY"], default: "ZALOPAY", required: true },

    // app_trans_id từ ZaloPay – dùng để đối soát / callback
    providerRef: { type: String, required: true, index: true },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    planTier: { type: String, enum: ["PRO"], required: true },
    period: { type: String, enum: ["month"], default: "month" },

    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
