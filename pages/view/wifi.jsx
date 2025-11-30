"use client";

import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function WifiLanding() {
  const { query } = useRouter();
  const ssid = (query.ssid || "").toString();
  const type = (query.type || "WPA").toString();
  const pass = (query.pass || "").toString();
  const hidden = (query.hidden || "").toString() === 'true';
  const title = (query.title || "Wi‑Fi Network").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const p1 = (query.accent || "#111827").toString();
  const p2 = (query.accent2 || "").toString();
  const cta = (query.cta || "Copy details").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#111827', secondary: p2 || '#374151' }), [p1, p2]);
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      const T = type === 'nopass' ? 'nopass' : type;
      const P = type === 'nopass' ? '' : `P:${pass};`;
      const H = hidden ? 'H:true;' : '';
      const esc = (v) => String(v).replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,');
      const s = `WIFI:T:${T};S:${esc(ssid)};${P}${H};`;
      await navigator.clipboard.writeText(s);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
          {ssid && <div className="mt-3 opacity-95">SSID: {ssid}</div>}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4 max-w-sm space-y-2">
          <div className="text-sm text-black/70">Security: {type}</div>
          {type !== 'nopass' && <div className="text-sm text-black/70">Password: {pass ? '••••••••' : '(none)'}</div>}
          {hidden && <div className="text-sm text-black/70">Hidden network</div>}
          <button onClick={onCopy} className="mt-3 px-4 py-2 rounded text-white w-full" style={{backgroundColor: theme.primary}}>{copied ? 'Copied' : cta}</button>
        </div>
      </div>
    </div>
  );
}

