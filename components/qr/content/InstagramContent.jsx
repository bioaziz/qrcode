"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function InstagramContent({ t, linkUrl, setLinkUrl, pdfTitle, setPdfTitle, pdfDescription, setPdfDescription }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1 block">Instagram username or URL</Label>
        <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="@yourname or https://instagram.com/yourname" />
      </div>
      <div>
        <Label className="mb-1 block">Title</Label>
        <Input value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Follow us on Instagram" />
      </div>
      <div>
        <Label className="mb-1 block">Description</Label>
        <Input value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description" />
      </div>
    </div>
  );
}

