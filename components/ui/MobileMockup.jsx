"use client";

import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.css";

export default function MobileMockup({ src, srcDoc = "", className = "", children, device = "Galaxy Note 8", color = "silver", width = 320, height = 650, zoom = 1 }) {
  return (
    <div className={`border-0 ${className || ''}`}>
      <DeviceFrameset device={device} color={color} width={width} height={height} zoom={zoom}>
        {src || srcDoc ? (
          <iframe title="Preview" style={{ width: "100%", height: "100%", border: 0 }} src={src || undefined} srcDoc={src ? undefined : srcDoc} />
        ) : (
          <div style={{ width: "100%", height: "100%" }}>{children}</div>
        )}
      </DeviceFrameset>
    </div>
  );
}
