"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULTS = [
  "#000000",
  "#111111",
  "#333333",
  "#666666",
  "#999999",
  "#ffffff",
  "#e11d48", // rose-600
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
];

export function ColorPicker({
  value,
  onChange,
  disabled = false,
  className,
  presetsKey = "qr-color-presets",
  id,
}) {
  const [presets, setPresets] = useState(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(presetsKey);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.every((c) => typeof c === "string")) {
          setPresets(Array.from(new Set([...DEFAULTS, ...arr])));
        }
      }
    } catch (_) {
      // ignore
    }
  }, [presetsKey]);

  const addPreset = () => {
    if (!value) return;
    const hex = String(value).toLowerCase();
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(hex)) return;
    const next = Array.from(new Set([hex, ...presets])).slice(0, 24);
    setPresets(next);
    try {
      localStorage.setItem(presetsKey, JSON.stringify(next.filter((c) => !DEFAULTS.includes(c))));
    } catch (_) {
      // ignore
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-10 w-16 cursor-pointer bg-transparent border border-black/20 rounded"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={addPreset}
          disabled={disabled}
          className={cn(
            "h-8 px-2 text-xs rounded border border-black/20",
            "bg-transparent hover:bg-black/5 disabled:opacity-50"
          )}
          title="Save current to presets"
        >
          Save
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((c) => (
          <button
            type="button"
            key={c}
            disabled={disabled}
            onClick={() => onChange?.(c)}
            className={cn(
              "h-6 w-6 rounded border",
              "border-black/20 ring-offset-1",
              value?.toLowerCase() === c.toLowerCase() ? "ring-2 ring-black" : ""
            )}
            style={{ background: c }}
            title={c}
            aria-label={`Use color ${c}`}
          />
        ))}
      </div>
    </div>
  );
}

