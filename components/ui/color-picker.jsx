"use client";

import { SketchPicker } from "react-color";
import { useEffect, useState } from "react";

export function ColorPicker({ color, onChange, disabled, ...props }) {
  const [recentColors, setRecentColors] = useState([]);

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
  };

  return (
    <div style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}>
      <SketchPicker
        color={color}
        onChangeComplete={handleChangeComplete}
        presetColors={recentColors}
        {...props}
      />
    </div>
  );
}

export default ColorPicker;
