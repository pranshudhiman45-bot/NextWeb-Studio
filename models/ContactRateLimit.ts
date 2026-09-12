import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const contactRateLimitSchema = new Schema({
  _id: { type: String, required: true },
  count: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
});

contactRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ContactRateLimit =
  models.ContactRateLimit ?? model("ContactRateLimit", contactRateLimitSchema);
