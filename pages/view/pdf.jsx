"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

async function sha256Hex(s) {
  try {
    const enc = new TextEncoder();
    const data = enc.encode(s);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const bytes = Array.from(new Uint8Array(digest));
    return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return "";
  }
}

export default function PdfLanding() {
  const router = useRouter();
  const { query } = router;

  const url = (query.url || "").toString();
  const title = (query.title || "").toString();
  const desc = (query.desc || "").toString();
  const company = (query.company || "").toString();
  const site = (query.site || "").toString();
  const cta = (query.cta || "View PDF").toString();
  const target = (query.target || "newtab").toString();
  const ph = (query.ph || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const style = (query.style || "minimal").toString();
  const accent = (query.accent || query.p1 || "#3b82f6").toString();
  const secondary = (query.accent2 || query.p2 || "").toString();
  const cover = (query.cover || "").toString();

  const [unlock, setUnlock] = useState(ph ? false : true);
  const [inputPw, setInputPw] = useState("");
  const [checking, setChecking] = useState(false);

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);

  // Derive secondary color if not provided
  const theme = useMemo(() => {
    const toRgb = (hex) => {
      const h = hex.replace('#','');
      if (h.length !== 6) return [59,130,246];
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    };
    const toHex = (n) => n.toString(16).padStart(2,'0');
    const adjust = (hex, f) => {
      const [r,g,b] = toRgb(hex);
      const rr = Math.max(0, Math.min(255, Math.round(r*f)));
      const gg = Math.max(0, Math.min(255, Math.round(g*f)));
      const bb = Math.max(0, Math.min(255, Math.round(b*f)));
      return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
    };
    const primary = accent || '#3b82f6';
    const secondaryColor = secondary || adjust(primary, 0.8);
    return { primary, secondary: secondaryColor };
  }, [accent, secondary]);

  const [canEmbed, setCanEmbed] = useState(false);
  useEffect(() => {
    setCanEmbed(false);
    try {
      if (!url) return;
      const u = new URL(url, location.origin);
      if (u.origin === location.origin || u.protocol === 'blob:' || u.protocol === 'data:') {
        setCanEmbed(true);
      }
    } catch {}
  }, [url]);

  const onOpen = () => {
    if (!url) return;
    if (target === "download") {
      const a = document.createElement("a");
      a.href = url;
      a.download = "file.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (target === "sametab") {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  };

  const onCheck = async (e) => {
    e.preventDefault();
    setChecking(true);
    const hex = await sha256Hex(inputPw);
    setChecking(false);
    if (hex && ph && hex === ph) setUnlock(true);
  };

  const Action = () => (
    ph && !unlock ? (
      <form onSubmit={onCheck} className="space-y-3">
        <label className="block text-sm">Enter password to continue</label>
        <input type="password" className="w-full border rounded px-3 py-2" value={inputPw} onChange={(e) => setInputPw(e.target.value)} />
        <button type="submit" disabled={checking} className="px-4 py-2 rounded text-white disabled:opacity-60" style={{backgroundColor: theme.primary}}>{checking ? "Checking..." : "Unlock"}</button>
      </form>
    ) : (
      <button onClick={onOpen} className="px-4 py-2 rounded text-white w-full" style={{backgroundColor: theme.primary}}>{cta || "View PDF"}</button>
    )
  );

  // Style variants: minimal | card | cover
  if (style === 'minimal') {
    return (
      <div className="min-h-screen w-full" style={bodyStyle}>
        <div className="max-w-2xl mx-auto px-5 py-10">
          {company && <div className="text-xs/5 mb-1 text-black/60">{company}</div>}
          {title && <h1 className="text-2xl md:text-3xl font-extrabold" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 text-black/70" style={bodyStyle}>{desc}</p>}

          {cover && (
            <div className="mt-6 rounded-xl border border-black/10 bg-white overflow-hidden">
              <img src={cover} alt={title || 'cover'} className="w-full h-[200px] object-cover" />
            </div>
          )}
          <div className="mt-6 rounded-xl border border-black/10 bg-white overflow-hidden">
            {url ? (
              canEmbed ? (
                <object data={url} type="application/pdf" className="w-full h-[380px] md:h-[440px]">
                  <div className="p-6 text-sm text-black/70">Preview not available. Use the button to open the file.</div>
                </object>
              ) : (
                <div className="p-6 flex items-center justify-center h-[260px] md:h-[320px] bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm text-black/60">Preview unavailable for this file source.</div>
                  </div>
                </div>
              )
            ) : (
              <div className="p-6 flex items-center justify-center h-[220px] md:h-[280px] bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm text-black/60">Upload a PDF to see a preview here.</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="max-w-sm">
              <Action />
            </div>
            {site && (
              <a href={site} target="_blank" rel="noreferrer" className="ml-0 mt-3 inline-block text-sm underline" style={{color: theme.secondary}}>{site}</a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (style === 'cover') {
    return (
      <div className="min-h-screen w-full" style={bodyStyle}>
        <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
          <div className="max-w-5xl mx-auto px-5 pt-10 pb-14 text-white">
            {company && <div className="text-xs/5 opacity-90 mb-1">{company}</div>}
            {title && <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
            {desc && <p className="mt-3 max-w-2xl opacity-95" style={bodyStyle}>{desc}</p>}

            {cover && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-white/20 overflow-hidden">
                <img src={cover} alt={title || 'cover'} className="w-full h-[220px] object-cover" />
              </div>
            )}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-white/20 overflow-hidden">
              {url ? (
                canEmbed ? (
                  <object data={url} type="application/pdf" className="w-full h-[420px] md:h-[520px]">
                    <div className="p-6 text-sm text-black/70">Preview not available. Use the button to open the file.</div>
                  </object>
                ) : (
                  <div className="p-6 flex items-center justify-center h-[260px] md:h-[320px] bg-white/80">
                    <div className="text-center text-black">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="text-sm opacity-80">Preview unavailable for this file source.</div>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-6 flex items-center justify-center h-[260px] md:h-[320px] bg-white/80">
                  <div className="text-center text-black">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm opacity-80">Upload a PDF to see a preview here.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 max-w-sm">
              <Action />
            </div>
            {site && (
              <a href={site} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline" style={{color: '#fff'}}>{site}</a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: card
  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
          {company && <div className="text-xs/5 opacity-90 mb-1">{company}</div>}
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95" style={bodyStyle}>{desc}</p>}
          {site && (
            <a href={site} target="_blank" rel="noreferrer" className="inline-block mt-3 underline decoration-white/60 underline-offset-4 opacity-95 hover:opacity-100">
              {site}
            </a>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-black/10 overflow-hidden">
            {cover && (
              <div className="w-full">
                <img src={cover} alt={title || 'cover'} className="w-full h-[200px] object-cover" />
              </div>
            )}
            {url ? (
              canEmbed ? (
                <object data={url} type="application/pdf" className="w-full h-[360px] md:h-[420px]">
                  <div className="p-6 text-sm text-black/70">Preview not available. Use the button to open the file.</div>
                </object>
              ) : (
                <div className="p-6 flex items-center justify-center h-[260px] md:h-[320px] bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm text-black/60">Preview unavailable for this file source.</div>
                  </div>
                </div>
              )
            ) : (
              <div className="p-6 flex items-center justify-center h-[220px] md:h-[280px] bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm text-black/60">Upload a PDF to see a preview here.</div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4">
              <div className="space-y-3">
                {company && <div className="text-xs text-black/60">{company}</div>}
                {title && <div className="text-lg font-semibold" style={titleStyle}>{title}</div>}
                {desc && <p className="text-sm text-black/70" style={bodyStyle}>{desc}</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4">
              <Action />
              {site && (
                <a href={site} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline" style={{color: theme.secondary}}>{site}</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
