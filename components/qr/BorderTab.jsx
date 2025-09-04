"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "next-i18next";

export default function BorderTab({
  borderWidth, setBorderWidth,
  borderColor, setBorderColor,
  borderRadius, setBorderRadius,
  borderText, setBorderText,
  borderTextColor, setBorderTextColor,
  borderFont, setBorderFont,
  borderLogo, setBorderLogo,
  borderLogoSize, setBorderLogoSize,
  patternColor, setPatternColor,
  onBorderLogoUpload,
}) {
  const { t } = useTranslation("common");
  const fontSize = parseInt(borderFont, 10) || 16;
  const fontFamily = borderFont.replace(/^\d+px\s*/, "");
  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1">{t("designerEditor.borderTab.text")}</Label>
          <Input value={borderText} onChange={(e) => setBorderText(e.target.value)} placeholder={t("designerEditor.borderTab.textPlaceholder") || "Scan me"} />
        </div>
        <div className="min-w-0">
          <Label className="block mb-1">{t("designerEditor.borderTab.textColor")}</Label>
          <Input type="color" value={borderTextColor} onChange={(e) => setBorderTextColor(e.target.value)} className="h-10 w-full cursor-pointer" />
        </div>
        <div className="min-w-0">
          <Label className="block mb-1">{t("designerEditor.borderTab.patternColor")}</Label>
          <Input type="color" value={patternColor} onChange={(e) => setPatternColor(e.target.value)} className="h-10 w-full cursor-pointer" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1">{t("designerEditor.borderTab.font")}</Label>
          <Select value={fontFamily} onValueChange={(v) => setBorderFont(`${fontSize}px ${v}`)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans-serif">Sans</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
              <SelectItem value="cursive">Cursive</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-0">
          <Label className="block mb-1">{t("designerEditor.borderTab.textSize")}: {fontSize}px</Label>
          <Slider min={10} max={40} value={[fontSize]} onValueChange={(v) => setBorderFont(`${v?.[0] ?? 16}px ${fontFamily}`)} />
        </div>
        <div className="min-w-0">
          <Label className="block mb-1">{t("designerEditor.borderTab.logoSize")}</Label>
          <Slider min={0.05} max={0.3} step={0.01} value={[borderLogoSize]} onValueChange={(v) => setBorderLogoSize(v?.[0] ?? 0.15)} />
        </div>
      </div>

      <div>
        <Label className="block mb-1">{t("designerEditor.borderTab.logoLabel")}</Label>
        <Input type="file" accept="image/*" onChange={onBorderLogoUpload} />
        {borderLogo && (
          <div className="flex items-center gap-3 mt-2 text-xs text-black/60 dark:text-white/60">
            <img src={borderLogo} alt={t("designerEditor.logoTab.logoAlt")} className="h-8 w-8 object-contain rounded" />
            <Button type="button" variant="outline" size="sm" onClick={() => setBorderLogo("")}>{t("designerEditor.borderTab.removeLogo")}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
