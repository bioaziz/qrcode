"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "next-i18next";

export default function BorderTab({
  borderWidth, setBorderWidth,
  borderColor, setBorderColor,
  borderRadius, setBorderRadius,
}) {
  const { t } = useTranslation("common");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="min-w-0">
        <Label className="block mb-1">{t("designerEditor.borderTab.width")}: {borderWidth}px</Label>
        <Slider min={0} max={32} value={[borderWidth]} onValueChange={(v) => setBorderWidth(v?.[0] ?? 0)} />
      </div>
      <div className="min-w-0">
        <Label className="block mb-1">{t("designerEditor.borderTab.color")}</Label>
        <Input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-10 w-full cursor-pointer" />
      </div>
      <div className="min-w-0">
        <Label className="block mb-1">{t("designerEditor.borderTab.radius")}: {borderRadius}px</Label>
        <Slider min={0} max={64} value={[borderRadius]} onValueChange={(v) => setBorderRadius(v?.[0] ?? 0)} />
      </div>
    </div>
  );
}
