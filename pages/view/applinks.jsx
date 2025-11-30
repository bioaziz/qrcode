"use client";

import {useEffect, useMemo} from "react";
import {useRouter} from "next/router";

function detectPlatform(ua) {
  const s = (ua || "").toLowerCase();
  const isAndroid = /android/.test(s);
  // iOS (iPhone/iPad/iPod); exclude MacOS Safari on Apple Silicon by checking touch
  const isIOS = /iphone|ipad|ipod/.test(s) || (/mac os x/.test(s) && 'ontouchend' in globalThis);
  if (isIOS) return 'ios';
  if (isAndroid) return 'android';
  return 'web';
}

export default function AppLinksLanding() {
  const {query} = useRouter();

  const ios = (query.ios || "").toString();
  const android = (query.android || "").toString();
  const web = (query.web || query.site || "").toString();
  const title = (query.title || "Get the app").toString();
  const desc = (query.desc || "").toString();
  const tf = (query.tf || "System").toString();
  const bf = (query.bf || "System").toString();
  const style = (query.style || "card").toString();
  const p1 = (query.accent || query.p1 || "#3b82f6").toString();
  const p2 = (query.accent2 || query.p2 || "").toString();
  const auto = (query.auto || "").toString(); // "device" | "1" enables device auto-redirect
  const ctaIos = (query.ctaIos || "App Store").toString();
  const ctaAndroid = (query.ctaAndroid || "Google Play").toString();
  const ctaWeb = (query.ctaWeb || "Open Website").toString();

  const titleStyle = useMemo(() => ({ fontFamily: tf === "System" ? "inherit" : tf, fontWeight: 700 }), [tf]);
  const bodyStyle = useMemo(() => ({ fontFamily: bf === "System" ? "inherit" : bf }), [bf]);
  const theme = useMemo(() => ({ primary: p1 || '#3b82f6', secondary: p2 || '#1d4ed8' }), [p1, p2]);

  // Auto-redirect by device when enabled
  useEffect(() => {
    if (!auto || auto === '0') return;
    const plat = detectPlatform(navigator.userAgent);
    const href = plat === 'ios' ? (ios || web) : plat === 'android' ? (android || web) : web;
    if (href) {
      const url = href.startsWith('http') ? href : `https://${href}`;
      const t = setTimeout(() => {
        try { window.location.replace(url); } catch { window.location.href = url; }
      }, 250);
      return () => clearTimeout(t);
    }
  }, [auto, ios, android, web]);

  const open = (href) => {
    if (!href) return;
    const url = href.startsWith('http') ? href : `https://${href}`;
    window.open(url, '_blank');
  };

  const Header = () => (
    <div className="w-full" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-10 text-white">
        {title && <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm" style={titleStyle}>{title}</h1>}
        {desc && <p className="mt-2 max-w-2xl opacity-95" style={bodyStyle}>{desc}</p>}
      </div>
    </div>
  );

  const Buttons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button disabled={!ios} onClick={() => open(ios)} className={`px-4 py-3 rounded text-white disabled:opacity-60`} style={{backgroundColor: theme.primary}}> {ctaIos}</button>
      <button disabled={!android} onClick={() => open(android)} className={`px-4 py-3 rounded text-white disabled:opacity-60`} style={{backgroundColor: theme.primary}}>▶ {ctaAndroid}</button>
      <button disabled={!web} onClick={() => open(web)} className={`px-4 py-3 rounded text-white disabled:opacity-60`} style={{backgroundColor: theme.primary}}>🌐 {ctaWeb}</button>
    </div>
  );

  if (style === 'minimal') {
    return (
      <div className="min-h-screen w-full" style={bodyStyle}>
        <div className="max-w-3xl mx-auto px-5 py-10">
          {title && <h1 className="text-2xl md:text-3xl font-extrabold" style={titleStyle}>{title}</h1>}
          {desc && <p className="mt-2 text-black/70" style={bodyStyle}>{desc}</p>}
          <div className="mt-6">
            <Buttons />
          </div>
        </div>
      </div>
    );
  }

  // Default: card with colored header
  return (
    <div className="min-h-screen w-full" style={bodyStyle}>
      <Header />
      <div className="max-w-3xl mx-auto px-5 -mt-8 pb-10">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-black/10 overflow-hidden">
            <div className="p-6 flex items-center justify-center h-[220px] md:h-[280px] bg-gray-50">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <div className="text-sm text-black/60">Choose your platform to continue.</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4">
              <div className="space-y-3">
                {title && <div className="text-lg font-semibold" style={titleStyle}>{title}</div>}
                {desc && <p className="text-sm text-black/70" style={bodyStyle}>{desc}</p>}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-black/10 p-4">
              <Buttons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

