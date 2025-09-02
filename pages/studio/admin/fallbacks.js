import { getServerSession } from "next-auth/next";
import { isAdminEmail } from "@/lib/admin";
import { dbConnect } from "@/lib/mongoose";
import Setting from "@/models/Setting";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export async function getServerSideProps(context) {
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/auth/signin", permanent: false } };
  if (!isAdminEmail(session.user?.email)) return { notFound: true };
  await dbConnect();
  const doc = await Setting.findOne({ key: 'fallback.redirect' }).lean();
  return { props: { initial: doc?.value || '' } };
}

export default function AdminFallbacks({ initial }) {
  const [url, setUrl] = useState(initial || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function save() {
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'fallback.redirect', value: url })});
      const js = await res.json();
      if (js?.success) setMsg('Saved'); else setMsg(js?.message || 'Error');
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin · Fallback Management</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">Global Fallback Redirect</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Destination URL when QR is missing/paused</label>
            <Input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://example.com/fallback" />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={save} disabled={saving}>{saving? 'Saving…':'Save'}</Button>
            {msg && <span className="text-sm opacity-70">{msg}</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
