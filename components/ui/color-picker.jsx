"use client";

import { SketchPicker } from "react-color";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DEFAULT_PRESETS = [
  "#111111", "#333333", "#555555", "#777777", "#999999", "#bbbbbb", "#dddddd",
  "#ffffff", "#ef7d20", "#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#eab308",
];

export function ColorPicker({ color, onChange, disabled, ...props }) {
  const [recentColors, setRecentColors] = useState([]);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  // Position the popover relative to the trigger and manage outside clicks
  useEffect(() => {
    if (!open) return;

    const place = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pickerWidth = 240; // approximate width of SketchPicker
      const spacing = 8;
      let left = rect.left;
      let top = rect.bottom + spacing;
      if (left + pickerWidth > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - pickerWidth - 8);
      }
      if (top + 320 > window.innerHeight - 8) {
        // If not enough space below, place above
        top = Math.max(8, rect.top - 320 - spacing);
      }
      setCoords({ top, left });
    };

    place();
    const onDocClick = (e) => {
      const inTrigger = containerRef.current?.contains(e.target);
      const inPopover = popoverRef.current?.contains(e.target);
      if (!inTrigger && !inPopover) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
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

  const toCss = (c) => {
    const { r, g, b, a } = c.rgb || {};
    if (typeof a === 'number' && a >= 0 && a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return c.hex;
  };

  const handleChange = (c) => {
    if (disabled) return;
    const css = toCss(c);
    onChange?.(css);
  };

  const handleChangeComplete = (c) => {
    if (disabled) return;
    const css = toCss(c);
    const updated = [css, ...recentColors.filter((col) => col !== css)].slice(0, 14);
    setRecentColors(updated);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("recentColors", JSON.stringify(updated));
      }
    } catch {
      // Ignore storage errors
    }
    onChange?.(css);
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
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-[9999]"
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Default presets (two rows) */}
          <div className="p-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/15 rounded-t-md shadow-sm">
            <div className="grid grid-cols-7 gap-1">
              {DEFAULT_PRESETS.slice(0, 7).map((col) => (
                <button
                  key={col}
                  type="button"
                  className="h-4 w-6 rounded border border-black/10 dark:border-white/15"
                  style={{ backgroundColor: col }}
                  onClick={(e) => { e.preventDefault(); onChange?.(col); }}
                  title={col}
                />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-1">
              {DEFAULT_PRESETS.slice(7, 14).map((col) => (
                <button
                  key={col}
                  type="button"
                  className="h-4 w-6 rounded border border-black/10 dark:border-white/15"
                  style={{ backgroundColor: col }}
                  onClick={(e) => { e.preventDefault(); onChange?.(col); }}
                  title={col}
                />
              ))}
            </div>
          </div>
          <SketchPicker
            color={color}
            onChange={handleChange}
            onChangeComplete={handleChangeComplete}
            presetColors={recentColors}
            {...props}
          />
        </div>,
        document.body
      )}
    </div>
  );
}

export default ColorPicker;
