import mongoose, { Schema } from "mongoose";

const BreakdownSchema = new Schema(
  {
    // store counts as a simple key->number object
  },
  { _id: false, strict: false }
);

const AnalyticsDailySchema = new Schema(
  {
    slug: { type: String, index: true, required: true },
    day: { type: String, index: true, required: true }, // YYYYMMDD (UTC)
    total: { type: Number, default: 0 },
    devices: { type: BreakdownSchema, default: {} },
    countries: { type: BreakdownSchema, default: {} },
    cities: { type: BreakdownSchema, default: {} },
  },
  { timestamps: true }
);

AnalyticsDailySchema.index({ slug: 1, day: 1 }, { unique: true });

export default mongoose.models.AnalyticsDaily || mongoose.model("AnalyticsDaily", AnalyticsDailySchema);

