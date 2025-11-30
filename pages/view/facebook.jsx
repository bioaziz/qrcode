"use client";

import { useRouter } from "next/router";
import { useMemo } from "react";

export default function FacebookLanding() {
  const { query } = useRouter();
  const raw = (query.url || query.page || "").toString();
  const normalized = useMemo(() => {
    const v = raw.trim();
    if (!v) return '';
    if (/facebook\.com\//i.test(v)) return v.startsWith('http') ? v : `https://${v}`;
    const slug = v.replace(/^@+/, '');
    return `https://facebook.com/${slug}`;
  }, [raw]);
  const title = (query.title || "Facebook").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const p1 = (query.accent || "#1d4ed8").toString();
  const p2 = (query.accent2 || "").toString();
  const cta = (query.cta || "Open Page").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#1d4ed8', secondary: p2 || '#1e40af' }), [p1, p2]);
  const onOpen = () => { if (normalized) window.open(normalized, '_blank'); };

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
          {normalized && (
            <a href={normalized} target="_blank" rel="noreferrer" className="inline-block mt-3 underline decoration-white/60 underline-offset-4 opacity-95 hover:opacity-100">
              {normalized}
            </a>
          )}
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

