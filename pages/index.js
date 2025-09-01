import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Sparkles, LineChart, Layers, ShieldCheck, Settings2, Rocket } from "lucide-react";

export default function Landing() {
  const { data: session } = useSession();
  const ctaHref = session ? "/qrs" : "/auth/signin";

  const Feature = ({ icon: Icon, title, desc }) => (
    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur border-black/10 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-black/5 dark:bg-white/10 p-2">
            <Icon className="size-5" />
          </div>
          <div>
            <div className="font-semibold mb-1">{title}</div>
            <div className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{desc}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0b0d12] dark:to-[#0a0f1b]">
      <main className="mx-auto max-w-6xl px-6 md:px-10 py-10 space-y-16">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-3 py-1 text-xs text-black/70 dark:text-white/70 mb-4">
              <Sparkles className="size-3.5" />
              Introducing Genius QR
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              Smarter, flexible QR codes with real‑time routing and analytics
            </h1>
            <p className="mt-4 text-black/70 dark:text-white/70 text-base leading-relaxed">
              Design beautiful QR codes, then direct each scan dynamically based on device, time, or A/B tests. Measure performance with built‑in analytics.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={ctaHref}><Button size="lg">{session ? "Go to My QRs" : "Get Started"}</Button></Link>
              <Link href="/designer"><Button size="lg" variant="outline">Open Designer</Button></Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-md bg-black/5 dark:bg-white/10 p-2"><QrCode className="size-5" /></div>
                <div className="font-medium">Designer Preview</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">Custom Styles</div>
                  <div className="text-black/70 dark:text-white/70">Dots, corners, gradients, and logos with error correction.</div>
                </div>
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">Dynamic Destinations</div>
                  <div className="text-black/70 dark:text-white/70">Rules by device/time/geo, A/B tests, rotations.</div>
                </div>
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">Instant Analytics</div>
                  <div className="text-black/70 dark:text-white/70">Scans counted in real time with device and geo breakdowns.</div>
                </div>
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">Share & Export</div>
                  <div className="text-black/70 dark:text-white/70">Export PNG/SVG/PDF, save designs, and reuse presets.</div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-x-8 -bottom-8 blur-3xl opacity-40 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-sky-500/20 rounded-3xl h-32" />
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold">Why Genius QR</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature icon={Settings2} title="Dynamic routing" desc="Send iOS to App Store, Android to Play, and desktop to your site. Add time‑based campaigns, geo rules, and fallbacks." />
            <Feature icon={LineChart} title="Built‑in analytics" desc="Track total and daily scans with device, country, and city distributions. Export CSV for deeper analysis." />
            <Feature icon={Layers} title="Designer presets" desc="Save styles to cloud presets and reuse across campaigns. Export high‑quality PNG, SVG, and PDF." />
            <Feature icon={QrCode} title="Beautiful codes" desc="Fine‑tune dots, corners, gradients, quiet zones, and logos with robust error correction." />
            <Feature icon={ShieldCheck} title="Reliable redirects" desc="Resilient redirects with optional global fallback URL when a code is paused or archived." />
            <Feature icon={Rocket} title="Fast setup" desc="Start in minutes. Create, style, and share your first QR without friction." />
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <div className="text-lg font-semibold">Ready to create your first Genius QR?</div>
            <div className="text-sm text-black/70 dark:text-white/70">Sign in to manage QRs and see real‑time analytics.</div>
          </div>
          <div className="flex gap-3">
            <Link href={ctaHref}><Button size="lg">{session ? "Open Dashboard" : "Get Started"}</Button></Link>
            <Link href="/designer"><Button size="lg" variant="outline">Open Designer</Button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
