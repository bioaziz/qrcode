"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function FacebookContent({ t, linkUrl, setLinkUrl, pdfTitle, setPdfTitle, pdfDescription, setPdfDescription }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1 block">Facebook page URL or slug</Label>
        <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://facebook.com/yourpage" />
      </div>
      <div>
        <Label className="mb-1 block">Title</Label>
        <Input value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Find us on Facebook" />
      </div>
      <div>
        <Label className="mb-1 block">Description</Label>
        <Input value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description" />
      </div>
    </div>
  );
}

