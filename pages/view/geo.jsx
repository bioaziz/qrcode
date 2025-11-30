"use client";

import { useRouter } from "next/router";
import { useMemo } from "react";

export default function GeoLanding() {
  const { query } = useRouter();
  const lat = (query.lat || query.latitude || query.y || "").toString();
  const lng = (query.lng || query.lon || query.longitude || query.x || "").toString();
  const label = (query.label || "").toString();
  const title = (query.title || "Open Location").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const p1 = (query.accent || "#059669").toString();
  const p2 = (query.accent2 || "").toString();
  const cta = (query.cta || "Open in Maps").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#059669', secondary: p2 || '#065f46' }), [p1, p2]);

  const onOpen = () => {
    if (!lat || !lng) return;
    const geo = `geo:${lat},${lng}` + (label ? `?q=${encodeURIComponent(label)}` : '');
    try {
      window.location.href = geo;
    } catch {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(lat+','+lng)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
          {(lat && lng) && <div className="mt-3 opacity-95">{lat}, {lng}</div>}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4 max-w-sm">
          <button onClick={onOpen} className="px-4 py-2 rounded text-white w-full" style={{backgroundColor: theme.primary}}>{cta}</button>
        </div>
      </div>
    </div>
  );
}

