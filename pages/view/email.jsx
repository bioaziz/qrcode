"use client";

import { useRouter } from "next/router";
import { useMemo } from "react";

export default function EmailLanding() {
  const { query } = useRouter();
  const to = (query.to || query.email || "").toString();
  const subject = (query.subject || "").toString();
  const body = (query.body || "").toString();
  const title = (query.title || "Send us an email").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const p1 = (query.accent || "#2563eb").toString();
  const p2 = (query.accent2 || "").toString();
  const cta = (query.cta || "Compose Email").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#2563eb', secondary: p2 || '#1d4ed8' }), [p1, p2]);
  const onEmail = () => {
    const p = new URLSearchParams();
    if (subject) p.set('subject', subject);
    if (body) p.set('body', body);
    const qs = p.toString();
    window.location.href = qs ? `mailto:${to}?${qs}` : `mailto:${to}`;
  };

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
          {to && <div className="mt-3 opacity-95">{to}</div>}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4 max-w-sm">
          <button onClick={onEmail} className="px-4 py-2 rounded text-white w-full" style={{backgroundColor: theme.primary}}>{cta}</button>
        </div>
      </div>
    </div>
  );
}

