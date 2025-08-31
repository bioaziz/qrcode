import Setting from "@/models/Setting";
import { dbConnect } from "@/lib/mongoose";

export async function getSetting(key, defaultValue = null) {
  await dbConnect();
  const doc = await Setting.findOne({ key }).lean();
  if (!doc) return defaultValue;
  return doc.value ?? defaultValue;
}
