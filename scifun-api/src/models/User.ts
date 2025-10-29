import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  otp: string;
  otpExpires: Date;
  isVerified: boolean;
  avatar: string;   
  role: "USER" | "ADMIN";
  dob: Date;
  sex: 0 | 1;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullname: { type: String, default: "New User" },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String, default: "https://res.cloudinary.com/dglm2f7sr/image/upload/v1761373988/default_awmzq0.jpg" },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
    required: true,
  },
  dob: { 
    type: Date, 
    default: () => new Date("2000-01-01") 
  },
  sex: { 
    type: Number, 
    enum: [0, 1],
    default: 1 
  },
});

export default mongoose.model<IUser>("User", UserSchema);
