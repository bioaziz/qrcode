"use client";

import { SketchPicker } from "react-color";
import { useEffect, useRef, useState } from "react";

export function ColorPicker({ color, onChange, disabled, ...props }) {
  const [recentColors, setRecentColors] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("recentColors");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRecentColors(parsed);
          }
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleChangeComplete = (c) => {
    if (disabled) return;
    const hex = c.hex;
    const updated = [hex, ...recentColors.filter((col) => col !== hex)].slice(0, 8);
    setRecentColors(updated);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("recentColors", JSON.stringify(updated));
      }
    } catch {
      // Ignore storage errors
    }
    onChange?.(hex);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
    >
      <div
        onClick={() => setOpen(true)}
        className="h-6 w-6 cursor-pointer rounded border"
        style={{ backgroundColor: color }}
      />
      {open && (
        <div className="absolute z-10 mt-2">
          <SketchPicker
            color={color}
            onChangeComplete={handleChangeComplete}
            presetColors={recentColors}
            {...props}
          />
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
