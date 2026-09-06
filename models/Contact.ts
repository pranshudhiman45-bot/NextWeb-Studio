import { model, models, Schema, type InferSchemaType } from "mongoose";

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true, default: "" },
    projectType: { type: String, required: true },
    budget: { type: String, required: true },
    timeline: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, trim: true, default: "contact-page" },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export type ContactDocument = InferSchemaType<typeof contactSchema>;

export const Contact = models.Contact ?? model("Contact", contactSchema);
