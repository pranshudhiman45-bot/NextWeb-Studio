import mongoose, { type InferSchemaType } from "mongoose";

const { model, models, Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    phoneNormalized: { type: String, required: true, index: true },
    company: { type: String, trim: true, default: "" },
    projectType: { type: String, required: true },
    budget: { type: String, required: true },
    timeline: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, trim: true, default: "contact-page" },
    // Optional for legacy inquiries; never infer delivery from persistence.
    inquirySaved: Boolean,
    notificationAttempted: Boolean,
    notificationAccepted: Boolean,
    resendEmailId: String,
    confirmationResendEmailId: String,
    emailNotificationStatus: {
      type: String,
      enum: ["pending", "accepted", "failed", "skipped"],
      default: "pending",
    },
    confirmationEmailStatus: {
      type: String,
      enum: ["pending", "accepted", "failed", "skipped"],
      default: "pending",
    },
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
