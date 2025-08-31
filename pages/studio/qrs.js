import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function QrStudio() {
  const { status } = useSession();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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

  async function createQuick() {
    const name = prompt("Name for this QR?") || "Untitled";
    const res = await fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "static", staticPayload: "https://example.com", meta: { name } }),
    });
    if (res.ok) fetchList();
  }

  if (status === "loading") return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My QR Codes</h1>
        <div className="flex gap-2">
          <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={fetchList} disabled={loading}>Search</Button>
          <Button onClick={createQuick}>New QR</Button>
          <Link href="/"><Button variant="outline">Open Designer</Button></Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it._id}>
            <CardHeader>
              <CardTitle className="text-base">{it?.meta?.name || it.slug}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm opacity-70">Type: {it.type}</div>
              <div className="text-sm">Slug: <code>{it.slug}</code></div>
              <div className="flex gap-2">
                <Link href={`/studio/qrs/${it._id}`} className="underline text-sm">Edit</Link>
                <a href={`/r/${it.slug}`} target="_blank" rel="noreferrer" className="underline text-sm">Open</a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { getServerSideProps } from "@/pages/index";

