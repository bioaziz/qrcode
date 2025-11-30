"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QrCode } from "lucide-react";

export default function FreeformContent({ t, data, setData }) {
  return (
    <div>
      <Label className="mb-1 flex items-center gap-2" htmlFor="freeform-content"><QrCode className="size-4"/> {t("designerEditor.contentTab.content")}</Label>
      <Input id="freeform-content" value={data} onChange={(e) => setData(e.target.value)} placeholder={t("designerEditor.contentTab.contentPlaceholder")} />
    </div>
  );
}

