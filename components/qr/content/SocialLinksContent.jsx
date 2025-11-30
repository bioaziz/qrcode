"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SocialLinksContent({
  t,
  socialLinks = [],
  setSocialLinks = () => {},
}) {
  const update = (i, field, val) => {
    const next = socialLinks.slice();
    next[i] = { ...(next[i] || {}), [field]: val };
    setSocialLinks(next);
  };
  const add = () => setSocialLinks([...(socialLinks || []), { platform: '', url: '', text: '' }]);
  const remove = (i) => setSocialLinks((socialLinks || []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="block">Social links (up to 6)</Label>
        <Button type="button" size="sm" variant="outline" onClick={add}>Add</Button>
      </div>
      <div className="space-y-2">
        {(socialLinks || []).slice(0,6).map((it, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
            <div>
              <Label className="mb-1 block">Platform</Label>
              <Input value={it.platform || ''} onChange={(e) => update(idx, 'platform', e.target.value)} placeholder="e.g. Instagram" />
            </div>
            <div>
              <Label className="mb-1 block">URL</Label>
              <Input value={it.url || ''} onChange={(e) => update(idx, 'url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex items-end gap-2">
              <div className="grow">
                <Label className="mb-1 block">Text</Label>
                <Input value={it.text || ''} onChange={(e) => update(idx, 'text', e.target.value)} placeholder="Follow" />
              </div>
              <Button type="button" variant="ghost" onClick={() => remove(idx)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

