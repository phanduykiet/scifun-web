import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  otp: string;
  otpExpires: Date;
  isVerified: boolean;
  avatar: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullname: { type: String, default: "New User" },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String, default: "https://example.com/default-avatar.png" }
});

export default mongoose.model<IUser>("User", UserSchema);
