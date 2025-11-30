"use client";

import { useRouter } from "next/router";
import { useMemo } from "react";

export default function SocialLanding() {
  const { query } = useRouter();
  const title = (query.title || "Links").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const p1 = (query.accent || "#111827").toString();
  const p2 = (query.accent2 || "").toString();

  const items = useMemo(() => {
    const out = [];
    for (let i = 1; i <= 6; i++) {
      const platform = (query[`s${i}p`] || '').toString();
      const url = (query[`s${i}u`] || '').toString();
      const text = (query[`s${i}t`] || '').toString();
      if (platform || url || text) out.push({ platform, url, text });
    }
    return out;
  }, [query]);

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#111827', secondary: p2 || '#374151' }), [p1, p2]);

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4 space-y-3">
          {items.length === 0 && <div className="text-sm text-black/60">No links provided.</div>}
          {items.map((it, idx) => (
            <a key={idx} href={it.url.startsWith('http') ? it.url : `https://${it.url}`} target="_blank" rel="noreferrer" className="block px-4 py-3 rounded border border-black/10 hover:bg-black/5">
              <div className="text-sm font-medium">{it.text || it.platform || it.url}</div>
              <div className="text-xs text-black/60">{it.url}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

