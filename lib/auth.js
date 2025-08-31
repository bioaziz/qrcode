import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function requireSession(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return null;
  return session;
}

