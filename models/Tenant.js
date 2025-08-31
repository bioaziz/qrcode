import mongoose, { Schema } from "mongoose";

const TenantSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    owners: [{ type: Schema.Types.ObjectId, ref: "User" }],
    apiKeys: [
      {
        key: String,
        scope: [String],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    plan: { type: String, default: "free" },
  },
  { timestamps: true }
);

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);

