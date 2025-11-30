"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MenuContent({ t, pdfTitle, setPdfTitle, pdfDescription, setPdfDescription, linkUrl, setLinkUrl, pdfCtaText, setPdfCtaText }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1 block">Title</Label>
        <Input value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Our Menu" />
      </div>
      <div>
        <Label className="mb-1 block">Description</Label>
        <Textarea value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description..." rows={3} />
      </div>
      <div>
        <Label className="mb-1 block">Menu URL</Label>
        <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com/menu" />
      </div>
      <div>
        <Label className="mb-1 block">Button text</Label>
        <Input value={pdfCtaText} onChange={(e) => setPdfCtaText(e.target.value)} placeholder="View Menu" />
      </div>
    </div>
  );
}

