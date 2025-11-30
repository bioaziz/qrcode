"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Map as MapIcon } from "lucide-react";

export default function MapsContent({ t, linkUrl, setLinkUrl }) {
  return (
    <div>
      <Label className="mb-1 flex items-center gap-2" htmlFor="maps-url"><MapIcon className="size-4"/> {t("designerEditor.contentTab.url")}</Label>
      <Input id="maps-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://maps.google.com/..." />
    </div>
  );
}

