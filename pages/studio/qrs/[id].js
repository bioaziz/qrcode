import { useState } from "react";
import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import Design from "@/models/Design";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
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

  // Helpers for dynamicConfig editing
  function withDyn(updater) {
    setCode((c) => {
      const base = c.dynamicConfig || {};
      const next = updater({
        primaryUrl: base.primaryUrl || "",
        fallbacks: base.fallbacks || { offlineUrl: "", ussd: "", sms: "" },
        abSplits: Array.isArray(base.abSplits) ? base.abSplits : [],
        rules: Array.isArray(base.rules) ? base.rules : [],
        rotation: base.rotation || { mode: null, stepSec: undefined, intervalMin: undefined, maxScans: undefined },
      });
      return { ...c, dynamicConfig: next };
    });
  }

  const parseCsv = (s) => (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  // Basic validation for dynamic fields
  const validation = (() => {
    const v = { rotation: "", abSplits: [] };
    if (code?.type === "dynamic") {
      const rot = code?.dynamicConfig?.rotation || {};
      if (rot?.mode === "totp" && (!(Number(rot.stepSec) >= 1))) {
        v.rotation = "Step seconds must be >= 1 for TOTP.";
      }
      if (rot?.mode === "interval" && (!(Number(rot.intervalMin) >= 1))) {
        v.rotation = "Interval minutes must be >= 1 for Interval.";
      }
      const splits = code?.dynamicConfig?.abSplits || [];
      v.abSplits = splits.map((s) => {
        if (typeof s?.ratio === "number" && (s.ratio < 0 || s.ratio > 1)) return "Ratio must be between 0 and 1.";
        return "";
      });
    }
    return v;
  })();
  const hasBlockingErrors = Boolean(validation.rotation) || (validation.abSplits || []).some(Boolean);

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
              <RadioGroup
                value={code.type || 'static'}
                onValueChange={(v) => onField('type', v)}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="type-static" value="static" />
                  <Label htmlFor="type-static">Static</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="type-dynamic" value="dynamic" />
                  <Label htmlFor="type-dynamic">Dynamic</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="type-wifi" value="wifi" />
                  <Label htmlFor="type-wifi">Wi‑Fi</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="type-vcard" value="vcard" />
                  <Label htmlFor="type-vcard">vCard</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="type-paylater" value="payLater" />
                  <Label htmlFor="type-paylater">Pay Later</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="type-ticket" value="ticket" />
                  <Label htmlFor="type-ticket">Ticket</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <label className="text-sm block mb-1">Static payload</label>
              <Input value={code.staticPayload || ''} onChange={(e) => onField('staticPayload', e.target.value)} />
            </div>
            <div>
              <div className="text-sm mb-1 flex items-center gap-2">
                <span>Dynamic primaryUrl</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>Default destination if no rule/rotation/A‑B applies.</TooltipContent>
                </Tooltip>
              </div>
              <Input value={code.dynamicConfig?.primaryUrl || ''} onChange={(e) => setCode((c) => ({ ...c, dynamicConfig: { ...(c.dynamicConfig||{}), primaryUrl: e.target.value } }))} placeholder="https://example.com" />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic routing configuration */}
        { (code.type === 'dynamic') && (
        <Card>
          <CardHeader><CardTitle className="text-base">Dynamic Routing</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {/* Rules */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <span>Rules (first match wins)</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>Leave fields empty to ignore that condition (device/geo/time).</TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                {(code.dynamicConfig?.rules || []).map((r, idx) => (
                  <div key={idx} className="rounded-md border p-3 space-y-2">
                    <div className="flex flex-wrap gap-3 items-end">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs block mb-1">Device</label>
                        <Select value={r.device || ""} onValueChange={(v) => withDyn((d) => {
                          const rules = [...(d.rules||[])];
                          rules[idx] = { ...(rules[idx]||{}), device: v || null };
                          return { ...d, rules };
                        })}>
                          <SelectTrigger className="w-full"><SelectValue placeholder="Any device" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any</SelectItem>
                            <SelectItem value="ios">iOS</SelectItem>
                            <SelectItem value="android">Android</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-[240px]">
                        <div className="text-xs mb-1 flex items-center gap-2">
                          <span>URL</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3.5 opacity-70" />
                            </TooltipTrigger>
                            <TooltipContent>Destination used when this rule matches.</TooltipContent>
                          </Tooltip>
                        </div>
                        <Input value={r.url || ''} onChange={(e) => withDyn((d) => {
                          const rules = [...(d.rules||[])];
                          rules[idx] = { ...(rules[idx]||{}), url: e.target.value };
                          return { ...d, rules };
                        })} placeholder="https://..." />
                      </div>
                      <Button variant="outline" onClick={() => withDyn((d) => ({ ...d, rules: (d.rules||[]).filter((_, i) => i !== idx) }))}>Remove</Button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs mb-1 flex items-center gap-2">
                          <span>Timezone (IANA)</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3.5 opacity-70" />
                            </TooltipTrigger>
                            <TooltipContent>Example: Africa/Porto-Novo, Europe/Paris</TooltipContent>
                          </Tooltip>
                        </div>
                        <Input value={r.when?.tz || ''} onChange={(e) => withDyn((d) => {
                          const rules = [...(d.rules||[])];
                          const when = { ...(rules[idx]?.when || {}), tz: e.target.value };
                          rules[idx] = { ...(rules[idx]||{}), when };
                          return { ...d, rules };
                        })} placeholder="Africa/Porto-Novo" />
                      </div>
                      <div>
                        <div className="text-xs mb-1 flex items-center gap-2">
                          <span>Days of week (0-6 CSV)</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3.5 opacity-70" />
                            </TooltipTrigger>
                            <TooltipContent>0=Sun, 1=Mon, ..., 6=Sat</TooltipContent>
                          </Tooltip>
                        </div>
                        <Input value={(r.when?.dayOfWeek||[]).join(',')} onChange={(e) => withDyn((d) => {
                          const rules = [...(d.rules||[])];
                          const arr = parseCsv(e.target.value).map((n) => Number(n)).filter((x) => Number.isFinite(x));
                          const when = { ...(rules[idx]?.when || {}), dayOfWeek: arr };
                          rules[idx] = { ...(rules[idx]||{}), when };
                          return { ...d, rules };
                        })} placeholder="1,2,3" />
                      </div>
                      <div>
                        <div className="text-xs mb-1 flex items-center gap-2">
                          <span>Hours (0-23 CSV)</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3.5 opacity-70" />
                            </TooltipTrigger>
                            <TooltipContent>24h format; leave empty for any hour</TooltipContent>
                          </Tooltip>
                        </div>
                        <Input value={(r.when?.hours||[]).join(',')} onChange={(e) => withDyn((d) => {
                          const rules = [...(d.rules||[])];
                          const arr = parseCsv(e.target.value).map((n) => Number(n)).filter((x) => Number.isFinite(x));
                          const when = { ...(rules[idx]?.when || {}), hours: arr };
                          rules[idx] = { ...(rules[idx]||{}), when };
                          return { ...d, rules };
                        })} placeholder="9,10,11" />
                      </div>
                      <div>
                        <label className="text-xs block mb-1">Countries (CSV, ISO code or name)</label>
                        <Input value={(r.geo?.country||[]).join(',')} onChange={(e) => withDyn((d) => {
                          const rules = [...(d.rules||[])];
                          const geo = { ...(rules[idx]?.geo || {}), country: parseCsv(e.target.value) };
                          rules[idx] = { ...(rules[idx]||{}), geo };
                          return { ...d, rules };
                        })} placeholder="BJ, NG" />
                      </div>
                      <div>
                        <label className="text-xs block mb-1">Cities (CSV)</label>
                        <Input value={(r.geo?.city||[]).join(',')} onChange={(e) => withDyn((d) => {
                          const rules = [...(d.rules||[])];
                          const geo = { ...(rules[idx]?.geo || {}), city: parseCsv(e.target.value) };
                          rules[idx] = { ...(rules[idx]||{}), geo };
                          return { ...d, rules };
                        })} placeholder="Cotonou, Porto-Novo" />
                      </div>
                    </div>
                    {!r?.url && <div className="text-[11px] text-amber-700">Tip: provide a URL for this rule to take effect.</div>}
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => withDyn((d) => ({ ...d, rules: [...(d.rules||[]), { device: null, url: "", when: {}, geo: {} }] }))}>Add rule</Button>
              </div>
            </div>

            {/* A/B Splits */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <span>A/B Splits</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>Weighted split; Rotation overrides with deterministic selection.</TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                {(code.dynamicConfig?.abSplits || []).map((s, idx) => (
                  <div key={idx} className="rounded-md border p-3 grid sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="text-xs block mb-1">Name</label>
                      <Input value={s.name || ''} onChange={(e) => withDyn((d) => {
                        const ab = [...(d.abSplits||[])];
                        ab[idx] = { ...(ab[idx]||{}), name: e.target.value };
                        return { ...d, abSplits: ab };
                      })} placeholder="A" />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Ratio (0..1)</label>
                      <Input type="number" step="0.01" min="0" max="1" value={typeof s.ratio === 'number' ? s.ratio : ''} onChange={(e) => withDyn((d) => {
                        const ab = [...(d.abSplits||[])];
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        ab[idx] = { ...(ab[idx]||{}), ratio: val };
                        return { ...d, abSplits: ab };
                      })} placeholder="0.5" />
                      {validation.abSplits?.[idx] && <div className="text-[11px] text-red-600 mt-1">{validation.abSplits[idx]}</div>}
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="text-xs block mb-1">URL</label>
                        <Input value={s.url || ''} onChange={(e) => withDyn((d) => {
                          const ab = [...(d.abSplits||[])];
                          ab[idx] = { ...(ab[idx]||{}), url: e.target.value };
                          return { ...d, abSplits: ab };
                        })} placeholder="https://..." />
                      </div>
                      <Button variant="outline" onClick={() => withDyn((d) => ({ ...d, abSplits: (d.abSplits||[]).filter((_, i) => i !== idx) }))}>Remove</Button>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => withDyn((d) => ({ ...d, abSplits: [...(d.abSplits||[]), { name: "", ratio: 0.5, url: "" }] }))}>Add split</Button>
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <span>Rotation</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent>TOTP uses step seconds; Interval uses minutes. Requires A/B splits.</TooltipContent>
                </Tooltip>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-xs block mb-1">Mode</label>
                  <Select value={code.dynamicConfig?.rotation?.mode || ''} onValueChange={(v) => withDyn((d) => ({
                    ...d,
                    rotation: { ...(d.rotation||{}), mode: v || null }
                  }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="totp">TOTP</SelectItem>
                      <SelectItem value="interval">Interval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs block mb-1">Step seconds (TOTP)</label>
                  <Input type="number" min="1" value={code.dynamicConfig?.rotation?.stepSec ?? ''} onChange={(e) => withDyn((d) => ({
                    ...d,
                    rotation: { ...(d.rotation||{}), stepSec: e.target.value === '' ? undefined : Number(e.target.value) }
                  }))} placeholder="30" />
                </div>
                <div>
                  <label className="text-xs block mb-1">Interval minutes</label>
                  <Input type="number" min="1" value={code.dynamicConfig?.rotation?.intervalMin ?? ''} onChange={(e) => withDyn((d) => ({
                    ...d,
                    rotation: { ...(d.rotation||{}), intervalMin: e.target.value === '' ? undefined : Number(e.target.value) }
                  }))} placeholder="60" />
                </div>
              </div>
              {validation.rotation && <div className="text-[11px] text-red-600">{validation.rotation}</div>}
            </div>
          </CardContent>
        </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Designer</CardTitle></CardHeader>
          <CardContent>
            <Designer embedded initialSnapshot={(design?.snapshot || design || null)} onSnapshotChange={setSnapshot} redirectUrl={redirectUrl} slug={code?.slug || null} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={saveAll} disabled={saving || hasBlockingErrors}>{saving ? 'Saving…' : 'Save'}</Button>
        {message && <span className="text-sm opacity-70">{message}</span>}
      </div>
    </div>
  );
}
