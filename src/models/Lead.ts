import mongoose, { Schema, Document, models } from "mongoose";

export interface ILead extends Document {
  name: string;
  email?: string;
  phone: string;
  source: "Contact" | "Estimator";
  message?: string;
  // Estimator fields
  plotSize?: string;
  floors?: number;
  materialType?: "Basic" | "Standard" | "Premium";
  estimatedCost?: string;
  status: "New" | "Contacted" | "Closed";
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    source: { type: String, required: true, enum: ["Contact", "Estimator"] },
    message: { type: String, required: false },
    plotSize: { type: String, required: false },
    floors: { type: Number, required: false },
    materialType: { type: String, required: false, enum: ["Basic", "Standard", "Premium"] },
    estimatedCost: { type: String, required: false },
    status: { type: String, default: "New", enum: ["New", "Contacted", "Closed"] }
  },
  { timestamps: true }
);

export const Lead = models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
