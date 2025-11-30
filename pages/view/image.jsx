"use client";

import { useMemo } from "react";
import { useRouter } from "next/router";

export default function ImageLanding() {
  const { query } = useRouter();
  const url = (query.url || "").toString();
  const title = (query.title || "Image").toString();
  const desc = (query.desc || "").toString();
  const site = (query.site || "").toString();
  const cta = (query.cta || "Open").toString();
  const target = (query.target || "newtab").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const style = (query.style || "minimal").toString();
  const p1 = (query.accent || query.p1 || "#3b82f6").toString();
  const p2 = (query.accent2 || query.p2 || "").toString();
  const cover = (query.cover || "").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => {
    const toRgb = (hex) => {
      const h = (hex || '').replace('#','');
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
    const primary = p1 || '#3b82f6';
    const secondary = p2 || adjust(primary, 0.8);
    return { primary, secondary };
  }, [p1, p2]);

  const onOpen = () => {
    if (!url) return;
    if (target === 'download') {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (target === 'sametab') {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  // Style variants: minimal | card | cover
  if (style === 'minimal') {
    return (
      <div className="min-h-screen w-full" style={bodyStyle}>
        <div className="max-w-2xl mx-auto px-5 py-10">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 text-black/70">{desc}</p>}

          {cover && (
            <div className="mt-6 rounded-xl border border-black/10 bg-white overflow-hidden">
              <img src={cover} alt={title || 'cover'} className="w-full h-[200px] object-cover" />
            </div>
          )}
          <div className="mt-6 rounded-xl border border-black/10 bg-white overflow-hidden">
            {url ? (
              <div className="bg-black/5 flex items-center justify-center">
                <img src={url} alt={title || 'image'} className="w-full h-[380px] md:h-[440px] object-contain" />
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-[220px] md:h-[280px] bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div className="text-sm text-black/60">Provide an image URL to see a preview here.</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <button onClick={onOpen} className="px-4 py-2 rounded text-white" style={{backgroundColor: theme.primary}}>{cta}</button>
            {site && (
              <a href={site} target="_blank" rel="noreferrer" className="ml-4 text-sm underline" style={{color: theme.secondary}}>{site}</a>
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
            {title && <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
            {desc && <p className="mt-3 max-w-2xl opacity-95">{desc}</p>}

            {cover && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-white/20 overflow-hidden">
                <img src={cover} alt={title || 'cover'} className="w-full h-[260px] object-cover" />
              </div>
            )}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-white/20 overflow-hidden">
              {url ? (
                <div className="bg-black/5 flex items-center justify-center">
                  <img src={url} alt={title || 'image'} className="w-full h-[420px] md:h-[520px] object-contain" />
                </div>
              ) : (
                <div className="p-6 flex items-center justify-center h-[260px] md:h-[320px] bg-white/80">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div className="text-sm opacity-80">Provide an image URL to see a preview here.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={onOpen} className="px-5 py-2.5 rounded text-white" style={{backgroundColor: theme.primary}}>{cta}</button>
              {site && (
                <a href={site} target="_blank" rel="noreferrer" className="text-sm underline" style={{color: '#fff'}}>{site}</a>
              )}
            </div>
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
          {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 max-w-2xl opacity-95">{desc}</p>}
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
              <div className="bg-black/5 flex items-center justify-center">
                <img src={url} alt={title || 'image'} className="w-full h-[360px] md:h-[420px] object-contain" />
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-[220px] md:h-[280px] bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div className="text-sm text-black/60">Provide an image URL to see a preview here.</div>
                </div>
              </div>
            )}
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
