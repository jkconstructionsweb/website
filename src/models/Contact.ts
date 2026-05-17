import mongoose, { Schema, Document, models } from "mongoose";

export interface IContact extends Document {
  phone: string;
  alternatePhone: string;
  email: string;
  alternateEmail: string;
  address: string;
  whatsapp: string;
  mapLink: string;
  businessHours: string[];
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    justdial: string;
    indiamart: string;
    youtube: string;
    pinterest: string;
  };
  socialLinks: { platform: string; url: string }[];
}

const ContactSchema = new Schema<IContact>(
  {
    phone: { type: String, default: "" },
    alternatePhone: { type: String, default: "" },
    email: { type: String, default: "" },
    alternateEmail: { type: String, default: "" },
    address: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    mapLink: { type: String, default: "" },
    businessHours: { type: [String], default: [] },
    socials: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      justdial: { type: String, default: "" },
      indiamart: { type: String, default: "" },
      youtube: { type: String, default: "" },
      pinterest: { type: String, default: "" },
    },
    socialLinks: {
      type: [
        {
          platform: { type: String },
          url: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Contact = models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
