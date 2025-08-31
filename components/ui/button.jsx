import { cn } from "@/lib/utils";

const variants = {
  default: "bg-black text-white hover:bg-black/90 border border-black",
  outline: "bg-transparent border border-black/20 hover:bg-black/5",
  ghost: "bg-transparent hover:bg-black/5",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({ as: Tag = "button", className, variant = "default", size = "md", ...props }) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

