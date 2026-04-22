import mongoose, { Schema, Document, models } from "mongoose";

export interface IPage extends Document {
  pageName: string; // e.g. "home", "about"
  sections: Record<string, any>;
}

const PageSchema = new Schema<IPage>(
  {
    pageName: { type: String, required: true, unique: true },
    sections: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Page = models.Page || mongoose.model<IPage>("Page", PageSchema);
