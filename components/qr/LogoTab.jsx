"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

export default function LogoTab({ onUpload, error, imageUrl, setImageUrl, imageSize, setImageSize, download, downloadPDF }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-1 flex items-center gap-2"><ImageIcon className="size-4"/> Logo (optional)</Label>
        <Input type="file" accept="image/*" onChange={onUpload} />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {imageUrl && (
          <div className="flex items-center gap-3 mt-2 text-xs text-black/60 dark:text-white/60">
            <img src={imageUrl} alt="logo" className="h-8 w-8 object-contain rounded" />
            <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl("")}>Remove</Button>
          </div>
        )}
      </div>
      <div>
        <Label className="block mb-1">Logo size</Label>
        <Slider min={0.15} max={0.45} step={0.01} value={[imageSize]} onValueChange={(val) => setImageSize(val?.[0] ?? 0.35)} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => download("png")}>Download PNG</Button>
        <Button type="button" variant="outline" onClick={() => download("svg")}>Download SVG</Button>
        <Button type="button" variant="outline" onClick={downloadPDF}>Download PDF</Button>
      </div>
    </div>
  );
}

