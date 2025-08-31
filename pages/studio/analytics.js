import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Analytics() {
  const { status } = useSession();
  const [slug, setSlug] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/summary?slug=${encodeURIComponent(slug)}&days=14`);
      const json = await res.json();
      if (json?.success) setData(json.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("slug");
      if (s) setSlug(s);
    }
  }, [status]);

  const dailyMax = useMemo(() => Math.max(1, ...(data?.daily?.map((d) => d.count) || [1])), [data]);

  if (status === "loading") return null;
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex gap-2">
          <Input placeholder="Slug (e.g. summer-campaign)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Button onClick={load} disabled={!slug || loading}>Load</Button>
          <Link href="/studio/qrs"><Button variant="outline">Back to Studio</Button></Link>
        </div>
      </div>

      {data && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Totals</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{data.total}</div>
              <div className="text-sm opacity-70">Total scans</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Devices</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(data.devices || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm"><span className="capitalize">{k}</span><span>{v}</span></div>
              ))}
              {!Object.keys(data.devices || {}).length && (
                <div className="text-sm opacity-70">No device data yet</div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-base">Last 14 days</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-14 gap-1 items-end h-32">
                {(data.daily || []).map((d) => (
                  <div key={d.day} className="flex flex-col items-center gap-1">
                    <div className="bg-foreground/80 dark:bg-foreground rounded w-3" style={{ height: `${(d.count / dailyMax) * 100}%` }} />
                    <span className="text-[10px] tabular-nums opacity-70">{d.day.slice(6)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export { getServerSideProps } from "@/pages/index";

