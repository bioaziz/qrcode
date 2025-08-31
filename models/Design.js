import mongoose, { Schema } from "mongoose";

const GradientSchema = new Schema(
  {
    enabled: Boolean,
    type: { type: String, enum: ["linear", "radial"], default: "linear" },
    start: String,
    mid: String,
    end: String,
    stops: { type: Number, default: 2 },
    rotation: { type: Number, default: 0 },
  },
  { _id: false }
);

const DesignSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", index: true },
    name: { type: String, required: true },
    dotType: { type: String, default: "square" },
    dotColor: { type: String, default: "#111111" },
    bgColor: { type: String, default: "#ffffff" },
    bgTransparent: { type: Boolean, default: false },
    dotGrad: GradientSchema,
    bgGrad: GradientSchema,
    cornerSquareType: { type: String, default: "square" },
    cornerSquareColor: { type: String, default: "#111111" },
    cornerDotType: { type: String, default: "dot" },
    cornerDotColor: { type: String, default: "#111111" },
    errorCorrection: { type: String, enum: ["L", "M", "Q", "H"], default: "M" },
    quietZone: { type: Number, default: 4 },
    imageSize: { type: Number, default: 0.35 },
  },
  { timestamps: true }
);

export default mongoose.models.Design || mongoose.model("Design", DesignSchema);

