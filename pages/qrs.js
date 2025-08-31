import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
const QRMini = dynamic(() => import("@/components/QRMini"), { ssr: false });

export default function UserQrs() {
  const { status } = useSession();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState("");
  const [selected, setSelected] = useState(null);
  const [testDest, setTestDest] = useState("");
  const [testing, setTesting] = useState(false);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/qr?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json?.success) setItems(json.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function openPreview(item) {
    setSelected(item);
    setOpenId(item?._id || "");
    setTestDest("");
  }

  function closePreview() {
    setOpenId("");
    setSelected(null);
    setTestDest("");
  }

  async function doTestResolve() {
    if (!selected?.slug) return;
    setTesting(true);
    try {
      const res = await fetch(`/api/qr/resolve?slug=${encodeURIComponent(selected.slug)}`);
      const json = await res.json();
      if (json?.success) setTestDest(json.destination || "");
    } finally {
      setTesting(false);
    }
  }

  if (status === "loading") return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">My QR Codes</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input placeholder="Search by name or slug…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={fetchList} disabled={loading}>Search</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it._id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base truncate" title={it?.meta?.name || it.slug}>
                  {it?.meta?.name || it.slug}
                </CardTitle>
                <Badge variant="secondary">{it.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 flex-1">
              <div className="text-sm opacity-70 truncate">Slug: <code>{it.slug}</code></div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => openPreview(it)}>Preview</Button>
                <Link href={`/r/${it.slug}`} target="_blank"><Button size="sm" variant="outline">Open</Button></Link>
                <Link href={`/studio/analytics?slug=${encodeURIComponent(it.slug)}`}><Button size="sm" variant="outline">Analytics</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!openId} onOpenChange={(v) => !v && closePreview()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>QR preview</DialogTitle>
            <DialogDescription>Quick look at data and actions.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{selected?.meta?.name || selected.slug}</div>
                  <div className="text-xs opacity-70">Slug: {selected.slug}</div>
                </div>
                <Badge>{selected.type}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <QRMini text={(typeof window !== "undefined") ? `${window.location.origin}/r/${selected.slug}` : `/r/${selected.slug}`} size={120} />
                <div className="text-xs opacity-70">
                  Encodes redirect URL
                  <div className="font-mono text-[11px] break-all">{(typeof window !== "undefined") ? `${window.location.origin}/r/${selected.slug}` : `/r/${selected.slug}`}</div>
                </div>
              </div>
              <div className="rounded-md border p-2 max-h-48 overflow-auto text-xs">
                <pre className="whitespace-pre-wrap break-words">{JSON.stringify({
                  type: selected.type,
                  staticPayload: selected.staticPayload,
                  dynamicConfig: selected.dynamicConfig,
                  meta: selected.meta,
                }, null, 2)}</pre>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link href={`/r/${selected.slug}`} target="_blank"><Button size="sm">Open Redirect</Button></Link>
                <Link href={`/m/${selected.slug}`}><Button size="sm" variant="outline">Open Micro‑app</Button></Link>
                <Link href={`/studio/analytics?slug=${encodeURIComponent(selected.slug)}`}><Button size="sm" variant="outline">Open Analytics</Button></Link>
                <Button size="sm" variant="outline" onClick={doTestResolve} disabled={testing}>Test resolve</Button>
              </div>
            </div>
          )}
          {testDest && (
            <div className="text-xs"><span className="opacity-70">Destination:</span> <span className="break-all underline">{testDest}</span></div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { getServerSideProps } from "@/pages/index";
