"use client";

import { useMemo } from "react";
import { useRouter } from "next/router";

export default function LinkLanding() {
  const { query } = useRouter();
  const url = (query.url || "").toString();
  const title = (query.title || "Link").toString();
  const desc = (query.desc || "").toString();
  const site = (query.site || url || "").toString();
  const cta = (query.cta || "Open").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const style = (query.style || "minimal").toString();
  const p1 = (query.accent || query.p1 || "#3b82f6").toString();
  const p2 = (query.accent2 || query.p2 || "").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#3b82f6', secondary: p2 || '#1d4ed8' }), [p1, p2]);

  const onOpen = () => { if (site) window.open(site.startsWith('http') ? site : `https://${site}`, '_blank'); };

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
          {site && (
            <a href={site.startsWith('http') ? site : `https://${site}`} target="_blank" rel="noreferrer" className="inline-block mt-3 underline decoration-white/60 underline-offset-4 opacity-95 hover:opacity-100">
              {site}
            </a>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-black/10 overflow-hidden">
            <div className="p-6 flex items-center justify-center h-[220px] md:h-[280px] bg-gray-50">
              <div className="text-center">
                <div className="text-4xl mb-2">🔗</div>
                <div className="text-sm text-black/60">This page will redirect visitors to the URL.</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4">
              <div className="space-y-3">
                {title && <div className="text-lg font-semibold" style={titleStyle}>{title}</div>}
                {desc && <p className="text-sm text-black/70">{desc}</p>}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4">
              <button onClick={onOpen} className="px-4 py-2 rounded text-white w-full" style={{backgroundColor: theme.primary}}>{cta}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

