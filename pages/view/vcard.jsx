"use client";

import { useRouter } from "next/router";
import { useMemo } from "react";

function buildVcard(q) {
  const fn = (q.fn || '').toString();
  const ln = (q.ln || '').toString();
  const org = (q.org || '').toString();
  const phone = (q.phone || '').toString();
  const email = (q.email || '').toString();
  const url = (q.url || '').toString();
  const street = (q.street || '').toString();
  const city = (q.city || '').toString();
  const state = (q.state || '').toString();
  const zip = (q.zip || '').toString();
  const country = (q.country || '').toString();
  const note = (q.note || '').toString();
  const lines = [];
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  lines.push(`N:${ln};${fn};;;`);
  const full = [fn, ln].filter(Boolean).join(' ');
  if (full) lines.push(`FN:${full}`);
  if (org) lines.push(`ORG:${org}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
  if (email) lines.push(`EMAIL:${email}`);
  if (street || city || state || zip || country) lines.push(`ADR;TYPE=HOME:;;${street};${city};${state};${zip};${country}`);
  if (url) lines.push(`URL:${url}`);
  if (note) lines.push(`NOTE:${note}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

export default function VcardLanding() {
  const { query } = useRouter();
  const title = (query.title || "Contact Card").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const p1 = (query.accent || "#334155").toString();
  const p2 = (query.accent2 || "").toString();
  const vcf = useMemo(() => buildVcard(query), [query]);

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#334155', secondary: p2 || '#0f172a' }), [p1, p2]);

  const onDownload = () => {
    try {
      const blob = new Blob([vcf], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contact.vcf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4 max-w-sm">
          <button onClick={onDownload} className="px-4 py-2 rounded text-white w-full" style={{backgroundColor: theme.primary}}>Download vCard</button>
        </div>
      </div>
    </div>
  );
}

