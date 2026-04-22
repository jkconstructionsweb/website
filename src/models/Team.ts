import mongoose, { Schema, Document, models } from "mongoose";

export interface ITeamMember extends Document {
  id: string; // The frontend uses 'id' instead of '_id' right now in some places, but we can store it or just let Mongoose handle it. We'll store it to ensure backward compatibility.
  name: string;
  role: string;
  exp: string;
  quote: string;
  image: string;
  bg: string;
  active: boolean;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    id: { type: String }, // Optional, mostly for frontend compat
    name: { type: String, required: true },
    role: { type: String, required: true },
    exp: { type: String, default: "" },
    quote: { type: String, default: "" },
    image: { type: String, default: "" },
    bg: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TeamMember = models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
