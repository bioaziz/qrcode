import { useEffect, useMemo, useState } from "react";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Analytics() {
  const { status } = useSession();
  const [slug, setSlug] = useState("");
  const [days, setDays] = useState(14);
  const [list, setList] = useState([]);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/summary?slug=${encodeURIComponent(slug)}&days=${encodeURIComponent(days * 2)}`);
      const json = await res.json();
      if (json?.success) setRaw(json.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("slug");
      if (s) setSlug(s);
      fetch('/api/qr').then(r=>r.json()).then(js=>{ if (js?.success) setList(js.items || []); }).catch(()=>{});
    }
  }, [status]);

  const view = useMemo(() => {
    if (!raw) return null;
    const allDaily = raw.daily || [];
    const last = allDaily.slice(-days);
    const prev = allDaily.slice(-(days * 2), -days);
    const sum = (arr) => arr.reduce((a, b) => a + Number(b?.count || 0), 0);
    const periodTotal = sum(last);
    const prevTotal = sum(prev);
    const deltaAbs = periodTotal - prevTotal;
    const deltaPct = prevTotal ? (deltaAbs / prevTotal) * 100 : (periodTotal ? 100 : 0);
    const avgPerDay = days ? periodTotal / days : 0;
    const activeDays = last.filter((d) => Number(d.count) > 0).length;
    let peak = { day: null, count: 0 };
    for (const d of last) if (Number(d.count) >= peak.count) peak = { day: d.day, count: Number(d.count) };
    const devices = Object.fromEntries(Object.entries(raw.devices || {}).map(([k, v]) => [k, Number(v)]));
    const countries = Object.fromEntries(Object.entries(raw.countries || {}).map(([k, v]) => [k, Number(v)]));
    const cities = Object.fromEntries(Object.entries(raw.cities || {}).map(([k, v]) => [k, Number(v)]));
    const dailyMax = Math.max(1, ...last.map((d) => Number(d.count) || 0));
    const totalAllTime = Number(raw.total || 0);
    return { last, prev, periodTotal, prevTotal, deltaAbs, deltaPct, avgPerDay, activeDays, peak, devices, countries, cities, dailyMax, totalAllTime };
  }, [raw, days]);

  if (status === "loading") return null;
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Slug (e.g. summer-campaign)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <select className="rounded-md border px-2 py-2" value={slug} onChange={(e)=>setSlug(e.target.value)}><option value="">Pick from list…</option>{list.map((it)=>(<option key={it._id} value={it.slug}>{it.meta?.name || it.slug}</option>))}</select>
          <Input type="number" className="w-24" value={days} onChange={(e)=>setDays(Number(e.target.value))} />
          <Button onClick={load} disabled={!slug || loading}>Load</Button>
          <Link href="/studio/qrs"><Button variant="outline">Back to Studio</Button></Link>
        </div>
      </div>

      {view && (
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">All‑time Scans</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{view.totalAllTime}</div>
                <div className="text-sm opacity-70">Across all time</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Last {days} days</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{view.periodTotal}</div>
                <div className={`text-sm ${view.deltaAbs === 0 ? 'opacity-70' : (view.deltaAbs > 0 ? 'text-green-600' : 'text-red-600')}`}>
                  {view.deltaAbs > 0 ? '+' : ''}{view.deltaAbs} ({view.deltaPct.toFixed(0)}%) vs prev
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Avg / Day</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{view.avgPerDay.toFixed(1)}</div>
                <div className="text-sm opacity-70">over last {days} days</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Active & Peak</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{view.activeDays}/{days}</div>
                <div className="text-sm opacity-70">Peak {view.peak.count} on {view.peak.day}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Last {days} days</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-36 overflow-x-auto">
                {view.last.map((d) => (
                  <div key={d.day} className="flex flex-col items-center gap-1">
                    <div className="bg-foreground/80 dark:bg-foreground rounded w-3" style={{ height: `${(Number(d.count) / view.dailyMax) * 100}%` }} />
                    <span className="text-[10px] tabular-nums opacity-70">{d.day.slice(6)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Devices</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(view.devices).length === 0 && <div className="text-sm opacity-70">No device data yet</div>}
                {Object.entries(view.devices).map(([k, v]) => {
                  const pct = view.periodTotal ? Math.round((Number(v) / view.periodTotal) * 100) : 0;
                  return (
                    <div key={k} className="text-sm">
                      <div className="flex justify-between"><span className="capitalize">{k}</span><span>{v} ({pct}%)</span></div>
                      <div className="h-1.5 bg-border rounded mt-1"><div className="h-full bg-foreground/70 rounded" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Top Countries</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.keys(view.countries).length === 0 && <div className="opacity-70">No data</div>}
                {Object.entries(view.countries).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,10).map(([k,v])=> {
                  const pct = view.periodTotal ? Math.round((Number(v)/view.periodTotal)*100) : 0;
                  return (
                    <div key={k}>
                      <div className="flex justify-between"><span>{k}</span><span>{v} ({pct}%)</span></div>
                      <div className="h-1.5 bg-border rounded mt-1"><div className="h-full bg-foreground/70 rounded" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Top Cities</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.keys(view.cities).length === 0 && <div className="opacity-70">No data</div>}
                {Object.entries(view.cities).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,10).map(([k,v])=> {
                  const pct = view.periodTotal ? Math.round((Number(v)/view.periodTotal)*100) : 0;
                  return (
                    <div key={k}>
                      <div className="flex justify-between"><span>{k}</span><span>{v} ({pct}%)</span></div>
                      <div className="h-1.5 bg-border rounded mt-1"><div className="h-full bg-foreground/70 rounded" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/auth/signin", permanent: false } };
  return { props: {} };
}
