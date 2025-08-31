import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-black/10 bg-white/70 dark:bg-black/30 backdrop-blur shadow-sm overflow-hidden min-w-0",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("p-5 pb-3 min-w-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold leading-tight break-words", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm opacity-70 leading-snug break-words", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5 pt-0 min-w-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("p-5 pt-0 min-w-0", className)} {...props} />;
}
