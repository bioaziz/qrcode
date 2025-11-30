"use client";

import { useRouter } from "next/router";
import { useMemo } from "react";

export default function MeCardLanding() {
  const { query } = useRouter();
  const title = (query.title || "Contact").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const p1 = (query.accent || "#334155").toString();
  const p2 = (query.accent2 || "").toString();
  const fn = (query.fn || "").toString();
  const ln = (query.ln || "").toString();
  const phone = (query.phone || "").toString();
  const email = (query.email || "").toString();
  const org = (query.org || "").toString();
  const url = (query.url || "").toString();
  const street = (query.street || "").toString();
  const city = (query.city || "").toString();
  const state = (query.state || "").toString();
  const zip = (query.zip || "").toString();
  const country = (query.country || "").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#334155', secondary: p2 || '#0f172a' }), [p1, p2]);

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4 space-y-1">
          <div className="text-lg font-semibold">{[fn, ln].filter(Boolean).join(' ')}</div>
          {org && <div className="text-sm text-black/70">{org}</div>}
          {phone && <div className="text-sm text-black/70">{phone}</div>}
          {email && <div className="text-sm text-black/70">{email}</div>}
          {url && <a className="text-sm underline" href={url} target="_blank" rel="noreferrer">{url}</a>}
          {[street, city, state, zip, country].some(Boolean) && (
            <div className="text-sm text-black/70">{[street, city, state, zip, country].filter(Boolean).join(', ')}</div>
          )}
        </div>
      </div>
    </div>
  );
}

