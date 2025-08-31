export function isAdminEmail(email) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || "").split(/[,\s]+/).filter(Boolean).map((s) => s.toLowerCase());
  return list.includes(String(email).toLowerCase());
}

