import mongoose, { Schema } from "mongoose";

const RuleSchema = new Schema(
  {
    when: {
      tz: String,
      dayOfWeek: [Number],
      hours: [Number],
    },
    geo: { country: [String], city: [String] },
    device: { type: String, enum: ["ios", "android", "desktop", null], default: null },
    url: String,
  },
  { _id: false }
);

const RotationSchema = new Schema(
  {
    mode: { type: String, enum: ["totp", "interval", null], default: null },
    stepSec: Number,
    intervalMin: Number,
    maxScans: Number,
  },
  { _id: false }
);

const AbSplitSchema = new Schema(
  {
    name: String,
    ratio: { type: Number, min: 0, max: 1 },
    url: String,
  },
  { _id: false }
);

const QrCodeSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    slug: { type: String, required: true, unique: true, index: true },

    type: {
      type: String,
      enum: ["static", "dynamic", "wifi", "vcard", "payLater", "ticket"],
      default: "static",
    },
    staticPayload: String,
    dynamicConfig: {
      primaryUrl: String,
      fallbacks: { offlineUrl: String, ussd: String, sms: String },
      abSplits: [AbSplitSchema],
      rules: [RuleSchema],
      rotation: RotationSchema,
    },

    designRef: { type: Schema.Types.ObjectId, ref: "Design" },
    status: { type: String, enum: ["active", "paused", "archived"], default: "active" },
    meta: { name: String, description: String, tags: [String] },

    security: {
      signingKid: String,
      replayWindowSec: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.QrCode || mongoose.model("QrCode", QrCodeSchema);

