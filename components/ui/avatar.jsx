import { cn } from "@/lib/utils";

export function Avatar({ src, alt = "", className, fallback, size = 32 }) {
  const sizeClass = size >= 40 ? "w-10 h-10" : size >= 32 ? "w-8 h-8" : "w-6 h-6";
  return (
    <div className={cn("rounded-full overflow-hidden bg-black/10", sizeClass, className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs opacity-70">
          {fallback || "?"}
        </div>
      )}
    </div>
  );
}

