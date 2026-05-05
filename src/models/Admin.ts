import mongoose, { Schema, Document, models } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  email: string;
  passwordHash: string;
  resetOtp?: string;
  resetOtpExpiry?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, default: "admin" },
    email: { type: String, required: true, default: "admin@jkconstructions.com" },
    passwordHash: { type: String, required: true },
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date }
  },
  { timestamps: true }
);

export const Admin = models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
