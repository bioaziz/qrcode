"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CouponContent({ t, pdfTitle, setPdfTitle, pdfDescription, setPdfDescription, linkUrl, setLinkUrl, pdfCtaText, setPdfCtaText }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1 block">Coupon title</Label>
        <Input value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="20% Off" />
      </div>
      <div>
        <Label className="mb-1 block">Details</Label>
        <Textarea value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short conditions / description..." rows={3} />
      </div>
      <div>
        <Label className="mb-1 block">Website or redeem link</Label>
        <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com/redeem" />
      </div>
      <div>
        <Label className="mb-1 block">Button text</Label>
        <Input value={pdfCtaText} onChange={(e) => setPdfCtaText(e.target.value)} placeholder="Redeem" />
      </div>
    </div>
  );
}

