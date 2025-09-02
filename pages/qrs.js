import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const QRMini = dynamic(() => import("@/components/QRMini"), { ssr: false });

export default function UserQrs() {
  const { status } = useSession();
  const { t } = useTranslation('common');
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState("");
  const [selected, setSelected] = useState(null);
  const [testDest, setTestDest] = useState("");
  const [testing, setTesting] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/qr?q=${encodeURIComponent(query)}&status=active`);
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

  async function deleteQr(item) {
    if (!item?._id) return;
    const ok = window.confirm(t('qrs.deleteConfirm'));
    if (!ok) return;
    setDeletingId(item._id);
    try {
      const res = await fetch(`/api/qr/${encodeURIComponent(item._id)}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x._id !== item._id));
        if (openId === item._id) closePreview();
      }
    } finally {
      setDeletingId("");
    }
  }

  if (status === "loading") return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">{t('qrs.title')}</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input placeholder={t('qrs.searchPlaceholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={fetchList} disabled={loading}>{t('qrs.search')}</Button>
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
              <div className="text-sm opacity-70">{t('qrs.slug')}: <code className="break-all">{it.slug}</code></div>
              <div className="flex gap-2 pt-2 flex-wrap">
                <Button size="sm" onClick={() => openPreview(it)}>{t('qrs.preview')}</Button>
                <Link href={`/r/${it.slug}`} target="_blank"><Button size="sm" variant="outline">{t('qrs.open')}</Button></Link>
                <Button size="sm" variant="outline" onClick={() => deleteQr(it)} disabled={deletingId === it._id}>{deletingId === it._id ? t('qrs.deleting') : t('qrs.delete')}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!openId} onOpenChange={(v) => !v && closePreview()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('qrs.previewTitle')}</DialogTitle>
            <DialogDescription>{t('qrs.previewDesc')}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{selected?.meta?.name || selected.slug}</div>
                  <div className="text-xs opacity-70">{t('qrs.slug')}: {selected.slug}</div>
                </div>
                <Badge>{selected.type}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <QRMini text={(typeof window !== "undefined") ? `${window.location.origin}/r/${selected.slug}` : `/r/${selected.slug}`} size={120} />
                <div className="text-xs opacity-70">
                  {t('qrs.encodesRedirect')}
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
                <Link href={`/r/${selected.slug}`} target="_blank"><Button size="sm">{t('qrs.openRedirect')}</Button></Link>
                <Link href={`/m/${selected.slug}`}><Button size="sm" variant="outline">{t('qrs.openMicro')}</Button></Link>
                <Button size="sm" variant="outline" onClick={() => deleteQr(selected)} disabled={deletingId === selected?._id}>{deletingId === selected?._id ? t('qrs.deleting') : t('qrs.delete')}</Button>
                <Button size="sm" variant="outline" onClick={doTestResolve} disabled={testing}>{t('qrs.testResolve')}</Button>
              </div>
            </div>
          )}
          {testDest && (
            <div className="text-xs"><span className="opacity-70">{t('qrs.destination')}</span> <span className="break-all underline">{testDest}</span></div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }

  return {
    props: {
      session,
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
}
