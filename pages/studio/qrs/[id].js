import { useState } from "react";
import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import Design from "@/models/Design";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
const Designer = dynamic(() => import("@/components/QRDesigner"), { ssr: false });

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const { serverSideTranslations } = await import("next-i18next/serverSideTranslations");
  const i18nConfig = (await import("../../../next-i18next.config.mjs")).default;
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }
  await dbConnect();
  const proto = ctx.req.headers['x-forwarded-proto'] || (ctx.req.connection?.encrypted ? 'https' : 'http');
  const host = ctx.req.headers['x-forwarded-host'] || ctx.req.headers.host || 'localhost:3000';
  const origin = `${proto}://${host}`;
  const { id } = ctx.params;
  const code = await QrCode.findById(id).lean();
  if (!code) return { notFound: true };
  let design = null;
  if (code.designRef) design = await Design.findById(code.designRef).lean();
  return {
    props: {
      initial: JSON.parse(JSON.stringify({ code, design, origin })),
      ...(await serverSideTranslations(ctx.locale, ["common"], i18nConfig)),
    },
  };
}

export default function EditQr({ initial }) {
  const [code, setCode] = useState(initial.code);
  const [design, setDesign] = useState(initial.design || null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [snapshot, setSnapshot] = useState(design || null);
  const redirectUrl = initial?.origin && code?.slug ? `${initial.origin}/r/${code.slug}` : null;

  function onField(k, v) {
    setCode((c) => ({ ...c, [k]: v }));
  }

  async function saveAll() {
    setSaving(true);
    setMessage("");
    try {
      let designId = code.designRef;
      if (snapshot) {
        const body = snapshot;
        if (designId) {
          await fetch(`/api/design/${designId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ snapshot: body, name: code?.meta?.name || 'Untitled' }) });
        } else {
          const res = await fetch('/api/design', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ snapshot: body, name: code?.meta?.name || 'Untitled' }) });
          const js = await res.json();
          if (js?.success) designId = js.item._id;
        }
      }
      const patch = {
        type: code.type,
        staticPayload: code.staticPayload,
        dynamicConfig: code.dynamicConfig,
        meta: code.meta,
        ...(designId ? { designRef: designId } : {}),
      };
      const r2 = await fetch(`/api/qr/${code._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
      if (!r2.ok) throw new Error('Save failed');
      setMessage('Saved');
    } catch (e) {
      setMessage(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Edit QR</h1>
        <div className="flex gap-2">
          <Link href={`/r/${code.slug}`} target="_blank"><Button variant="outline">Open</Button></Link>
          <Link href={`/studio/analytics?slug=${encodeURIComponent(code.slug)}`}><Button variant="outline">Analytics</Button></Link>
          <Link href="/qrs"><Button variant="outline">Back to list</Button></Link>
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">QR Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm block mb-1">Name</label>
              <Input value={code.meta?.name || ''} onChange={(e) => setCode((c) => ({ ...c, meta: { ...(c.meta||{}), name: e.target.value } }))} />
            </div>
            <div>
              <label className="text-sm block mb-1">Type</label>
              <Input value={code.type || ''} onChange={(e) => onField('type', e.target.value)} />
            </div>
            <div>
              <label className="text-sm block mb-1">Static payload</label>
              <Input value={code.staticPayload || ''} onChange={(e) => onField('staticPayload', e.target.value)} />
            </div>
            <div>
              <label className="text-sm block mb-1">Dynamic primaryUrl</label>
              <Input value={code.dynamicConfig?.primaryUrl || ''} onChange={(e) => setCode((c) => ({ ...c, dynamicConfig: { ...(c.dynamicConfig||{}), primaryUrl: e.target.value } }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Designer</CardTitle></CardHeader>
          <CardContent>
            <Designer embedded initialSnapshot={(design?.snapshot || design || null)} onSnapshotChange={setSnapshot} redirectUrl={redirectUrl} slug={code?.slug || null} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={saveAll} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        {message && <span className="text-sm opacity-70">{message}</span>}
      </div>
    </div>
  );
}
