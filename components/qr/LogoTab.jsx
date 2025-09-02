"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function LogoTab({ onUpload, error, imageUrl, setImageUrl, imageSize, setImageSize, download, downloadPDF }) {
  const { t } = useTranslation("common");
  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-1 flex items-center gap-2"><ImageIcon className="size-4"/> {t("designerEditor.logoTab.logoLabel")}</Label>
        <Input type="file" accept="image/*" onChange={onUpload} />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {imageUrl && (
          <div className="flex items-center gap-3 mt-2 text-xs text-black/60 dark:text-white/60">
            <img src={imageUrl} alt="logo" className="h-8 w-8 object-contain rounded" />
            <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl("")}>{t("designerEditor.logoTab.remove")}</Button>
          </div>
        )}
      </div>
      <div>
        <Label className="block mb-1">{t("designerEditor.logoTab.logoSizeLabel")}</Label>
        <Slider min={0.15} max={0.45} step={0.01} value={[imageSize]} onValueChange={(val) => setImageSize(val?.[0] ?? 0.35)} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => download("png")}>{t("designerEditor.logoTab.downloadPng")}</Button>
        <Button type="button" variant="outline" onClick={() => download("svg")}>{t("designerEditor.logoTab.downloadSvg")}</Button>
        <Button type="button" variant="outline" onClick={downloadPDF}>{t("designerEditor.logoTab.downloadPdf")}</Button>
      </div>
    </div>
  );
}

