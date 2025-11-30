"use client";

import { useMemo, useState } from "react";
import { Globe, Youtube, Instagram, Facebook, Music2, Film, Tv } from "lucide-react";
import { useRouter } from "next/router";

export default function VideoLanding() {
  const { query } = useRouter();
  const url = (query.url || "").toString();
  const title = (query.title || "Video").toString();
  const desc = (query.desc || "").toString();
  const site = (query.site || "").toString();
  const cta = (query.cta || "Watch").toString();
  const target = (query.target || "newtab").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const style = (query.style || "card").toString();
  const p1 = (query.accent || query.p1 || "#3b82f6").toString();
  const p2 = (query.accent2 || query.p2 || "").toString();
  const cover = (query.cover || "").toString();
  const ph = (query.ph || "").toString();
  const [unlock, setUnlock] = useState(ph ? false : true);
  const [inputPw, setInputPw] = useState("");
  const [checking, setChecking] = useState(false);
  const socials = useMemo(() => {
    const out = [];
    for (let i = 1; i <= 6; i++) {
      const p = (query[`s${i}p`] || '').toString();
      const u = (query[`s${i}u`] || '').toString();
      const t = (query[`s${i}t`] || '').toString();
      if (p || u || t) out.push({ platform: p, url: u, text: t });
    }
    return out;
  }, [query]);
  const SocialIcon = ({ name }) => {
    const k = (name || '').toLowerCase();
    const cls = "w-4 h-4";
    if (k === 'youtube') return <Youtube className={cls} />;
    if (k === 'instagram') return <Instagram className={cls} />;
    if (k === 'tiktok') return <Music2 className={cls} />;
    if (k === 'facebook') return <Facebook className={cls} />;
    if (k === 'vimeo') return <Film className={cls} />;
    if (k === 'tv') return <Tv className={cls} />;
    return <Globe className={cls} />;
  };

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
      a.download = 'video';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (target === 'sametab') {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  const onCheck = async (e) => {
    e.preventDefault();
    try {
      setChecking(true);
      const enc = new TextEncoder();
      const data = enc.encode(inputPw);
      const digest = await crypto.subtle.digest('SHA-256', data);
      const bytes = Array.from(new Uint8Array(digest));
      const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
      setChecking(false);
      if (ph && hex === ph) setUnlock(true);
    } catch {
      setChecking(false);
    }
  };

  const Poster = () => (cover ? <img src={cover} alt={title || 'cover'} className="w-full h-[220px] object-cover" /> : null);
  const Player = () => (
    unlock ? (
      <video controls className="w-full" poster={cover || undefined} src={url} />
    ) : (
      <form onSubmit={onCheck} className="space-y-3">
        <label className="block text-sm">Enter password to continue</label>
        <input type="password" className="w-full border rounded px-3 py-2" value={inputPw} onChange={(e) => setInputPw(e.target.value)} />
        <button type="submit" disabled={checking} className="px-4 py-2 rounded text-white disabled:opacity-60" style={{backgroundColor: theme.primary}}>{checking ? 'Checking...' : 'Unlock'}</button>
      </form>
    )
  );

  if (style === 'minimal') {
    return (
      <div className="min-h-screen w-full" style={bodyStyle}>
        <div className="max-w-2xl mx-auto px-5 py-10">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 text-black/70">{desc}</p>}

          {cover && (
            <div className="mt-6 rounded-xl border border-black/10 bg-white overflow-hidden">
              <Poster />
            </div>
          )}
          <div className="mt-6 rounded-xl border border-black/10 bg-white overflow-hidden p-4">
            {url ? <Player /> : (
              <div className="p-6 flex items-center justify-center h-[160px] bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="text-sm text-black/60">Upload or provide a video URL to preview.</div>
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
          {!!socials.length && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {socials.map((s, i) => (
                <a key={i} href={s.url || '#'} target="_blank" rel="noreferrer" className="rounded-xl border border-black/10 bg-white hover:bg-black/5 p-3 inline-flex items-center gap-2">
                  <SocialIcon name={s.platform} />
                  <span className="text-sm font-medium">{s.text || s.platform || 'Link'}</span>
                </a>
              ))}
            </div>
          )}
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
                <Poster />
              </div>
            )}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-white/20 overflow-hidden p-4">
              {url ? <Player /> : (
                <div className="p-6 flex items-center justify-center h-[180px] bg-white/80">
                  <div className="text-center text-black">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-sm opacity-80">Upload or provide a video URL to preview.</div>
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
            {!!socials.length && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {socials.map((s, i) => (
                  <a key={i} href={s.url || '#'} target="_blank" rel="noreferrer" className="rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 p-3 inline-flex items-center gap-2 text-white">
                    <SocialIcon name={s.platform} />
                    <span className="text-sm font-medium">{s.text || s.platform || 'Link'}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // default: card
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
          <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-black/10 overflow-hidden p-0">
            {cover && (
              <div className="w-full">
                <Poster />
              </div>
            )}
            <div className="p-4">
              {url ? <Player /> : (
                <div className="p-6 flex items-center justify-center h-[180px] bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-sm text-black/60">Upload or provide a video URL to preview.</div>
                  </div>
                </div>
              )}
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
              {site && (
                <a href={site} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline" style={{color: theme.secondary}}>{site}</a>
              )}
            </div>
            {!!socials.length && (
              <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4">
                <div className="grid grid-cols-2 gap-3">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url || '#'} target="_blank" rel="noreferrer" className="rounded-xl border border-black/10 bg-white hover:bg-black/5 p-3 inline-flex items-center gap-2">
                      <SocialIcon name={s.platform} />
                      <span className="text-sm font-medium">{s.text || s.platform || 'Link'}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
