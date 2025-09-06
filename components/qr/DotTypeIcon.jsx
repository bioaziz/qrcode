export default function DotTypeIcon({ type, className = "" }) {
  const t = String(type || "").toLowerCase();

  const base = "inline-block w-4 h-4 bg-black";

  if (t === "dots") {
    return <span className={`${base} rounded-full ${className}`} />;
  }

  if (t === "rounded") {
    return <span className={`${base} rounded-md ${className}`} />;
  }

  if (t === "classy") {
    const style = { borderTopLeftRadius: "9999px", borderBottomRightRadius: "9999px", borderTopRightRadius: "6px", borderBottomLeftRadius: "6px" };
    return <span className={`${base} ${className}`} style={style} />;
  }

  // default: square
  return <span className={`${base} ${className}`} />;
}
