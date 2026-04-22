import mongoose, { Schema, Document, models } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: "Residential" | "Commercial" | "Interior";
  cost: string;
  location: string;
  timeline: string;
  description: string;
  images: string[];
  featured: boolean;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["Residential", "Commercial", "Interior"] 
    },
    cost: { type: String, required: true },
    location: { type: String, required: true },
    timeline: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Project = models.Project || mongoose.model<IProject>("Project", ProjectSchema);
