import mongoose, { Schema, Document, models } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
  content: string;
  author: string;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    featuredImage: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" }
  },
  { timestamps: true }
);

export const Blog = models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
