"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette, Shapes, Maximize2, Shield } from "lucide-react";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import DotTypeIcon from "@/components/qr/DotTypeIcon";
import { ColorPicker } from "@/components/ui/color-picker";

export default function StyleTab(props) {
  const {
    size, setSize,
    quietZone, setQuietZone,
    errorCorrection, setErrorCorrection,
    dotType, setDotType,
    dotColor, setDotColor,
    dotGradEnabled, setDotGradEnabled,
    dotGradType, setDotGradType,
    dotGradStart, setDotGradStart,
    dotGradMid, setDotGradMid,
    dotGradEnd, setDotGradEnd,
    dotGradStops, setDotGradStops,
    dotGradRotation, setDotGradRotation,
    bgColor, setBgColor,
    bgTransparent, setBgTransparent,
    bgGradEnabled, setBgGradEnabled,
    bgGradType, setBgGradType,
    bgGradStart, setBgGradStart,
    bgGradMid, setBgGradMid,
    bgGradEnd, setBgGradEnd,
    bgGradStops, setBgGradStops,
    bgGradRotation, setBgGradRotation,
    dotTypes,
  } = props;

  const { t } = useTranslation("common");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1 flex flex-wrap items-center gap-2"><Maximize2 className="size-4"/> {t("designerEditor.styleTab.size")}: {size}px</Label>
          <Slider min={128} max={512} value={[size]} onValueChange={(val) => setSize(val?.[0] ?? 256)} />
        </div>
        <div className="min-w-0">
          <Label className="block mb-1 flex flex-wrap items-center gap-2"><Maximize2 className="size-4"/> {t("designerEditor.styleTab.quietZone")}: {quietZone}px</Label>
          <Slider min={0} max={32} value={[quietZone]} onValueChange={(val) => setQuietZone(val?.[0] ?? 4)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1 flex items-center gap-2"><Shield className="size-4"/> {t("designerEditor.styleTab.errorCorrection")}</Label>
          <RadioGroup value={errorCorrection} onValueChange={setErrorCorrection} className="grid grid-cols-4 gap-2">
            {[
              { v: "L", label: t("designerEditor.styleTab.errorLow") },
              { v: "M", label: t("designerEditor.styleTab.errorMedium") },
              { v: "Q", label: t("designerEditor.styleTab.errorQuartile") },
              { v: "H", label: t("designerEditor.styleTab.errorHigh") },
            ].map(({ v, label }) => (
              <label key={v} htmlFor={`ec-${v}`} className={cn(
                "flex items-center justify-center rounded-md border p-2 text-xs cursor-pointer",
                "hover:bg-black/5 transition-colors",
                errorCorrection === v ? "ring-2 ring-black border-black" : "border-black/20"
              )}>
                <RadioGroupItem id={`ec-${v}`} value={v} className="sr-only" />
                <div className="flex items-center gap-2">
                  <span className="font-medium">{v}</span>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1 flex flex-wrap items-center gap-2"><Shapes className="size-4"/> {t("designerEditor.styleTab.dotsType")}</Label>
          <RadioGroup value={dotType} onValueChange={setDotType} className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dotTypes.map((type) => (
              <label key={type} htmlFor={`dot-${type}`} className={cn(
                "flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer",
                "hover:bg-black/5 transition-colors",
                dotType === type ? "ring-2 ring-black border-black" : "border-black/20"
              )}>
                <RadioGroupItem id={`dot-${type}`} value={type} className="sr-only" />
                <DotTypeIcon type={type} />
                <span className="truncate">{type}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
        {!dotGradEnabled && (
          <div className="min-w-0">
            <label className="block text-sm font-medium mb-1 flex flex-wrap items-center gap-2"><Palette className="size-4"/> {t("designerEditor.styleTab.dotsColor")}</label>
            <ColorPicker value={dotColor} onChange={setDotColor} />
          </div>
        )}
        {dotGradEnabled && (
          <div className="space-y-2 min-w-0">
            <label className="block text-sm font-medium flex flex-wrap items-center gap-2"><Palette className="size-4"/> {t("designerEditor.styleTab.dotsGradient")}</label>
            <div className="grid grid-cols-2 gap-2">
              <ColorPicker value={dotGradStart} onChange={setDotGradStart} />
              {dotGradStops === 3 ? (
                <ColorPicker value={dotGradMid} onChange={setDotGradMid} />
              ) : (
                <div />
              )}
              <ColorPicker value={dotGradEnd} onChange={setDotGradEnd} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={dotGradType} onValueChange={setDotGradType}>
                <SelectTrigger className="w-full truncate"><SelectValue placeholder={t("designerEditor.styleTab.typePlaceholder")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">{t("designerEditor.styleTab.linear")}</SelectItem>
                  <SelectItem value="radial">{t("designerEditor.styleTab.radial")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="min-w-0">
                <Label className="block text-xs mb-1">{t("designerEditor.styleTab.rotation")}</Label>
                <Input type="number" step={0.1} value={dotGradRotation} onChange={(e) => setDotGradRotation(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <RadioGroup className="flex items-center gap-3 text-xs" value={String(dotGradStops)} onValueChange={(v) => setDotGradStops(parseInt(v, 10))}>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="dotstops-2" value="2" />
                <Label htmlFor="dotstops-2">{t("designerEditor.styleTab.stops2")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="dotstops-3" value="3" />
                <Label htmlFor="dotstops-3">{t("designerEditor.styleTab.stops3")}</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1 flex flex-wrap items-center gap-2"><Palette className="size-4"/> {t("designerEditor.styleTab.background")}</label>
          {!bgGradEnabled && (
            <ColorPicker value={bgColor} onChange={setBgColor} disabled={bgTransparent} />
          )}
          {bgGradEnabled && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <ColorPicker value={bgGradStart} onChange={setBgGradStart} disabled={bgTransparent} />
                {bgGradStops === 3 ? (
                  <ColorPicker value={bgGradMid} onChange={setBgGradMid} disabled={bgTransparent} />
                ) : (
                  <div />
                )}
                <ColorPicker value={bgGradEnd} onChange={setBgGradEnd} disabled={bgTransparent} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={bgGradType} onValueChange={setBgGradType} disabled={bgTransparent}>
                  <SelectTrigger className="w-full truncate"><SelectValue placeholder={t("designerEditor.styleTab.typePlaceholder")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">{t("designerEditor.styleTab.linear")}</SelectItem>
                    <SelectItem value="radial">{t("designerEditor.styleTab.radial")}</SelectItem>
                  </SelectContent>
                </Select>
                <div className="min-w-0">
                  <Label className="block text-xs mb-1">{t("designerEditor.styleTab.rotation")}</Label>
                  <Input type="number" step={0.1} value={bgGradRotation} onChange={(e) => setBgGradRotation(parseFloat(e.target.value) || 0)} disabled={bgTransparent} />
                </div>
              </div>
              <RadioGroup className="flex items-center gap-3 text-xs" value={String(bgGradStops)} onValueChange={(v) => setBgGradStops(parseInt(v, 10))} disabled={bgTransparent}>
                <div className="flex items-center gap-2 text-xs">
                  <RadioGroupItem id="bgstops-2" value="2" />
                  <Label htmlFor="bgstops-2">{t("designerEditor.styleTab.stops2")}</Label>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <RadioGroupItem id="bgstops-3" value="3" />
                  <Label htmlFor="bgstops-3">{t("designerEditor.styleTab.stops3")}</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          <div className="flex flex-wrap items-start sm:items-center gap-3 sm:gap-4 mt-2 w-full">
            <div className="flex items-center gap-2 text-xs">
              <Switch id="bg-transparent" checked={bgTransparent} onCheckedChange={setBgTransparent} />
              <Label htmlFor="bg-transparent">{t("designerEditor.styleTab.transparent")}</Label>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Switch id="dots-gradient" checked={dotGradEnabled} onCheckedChange={setDotGradEnabled} />
              <Label htmlFor="dots-gradient">{t("designerEditor.styleTab.dotsGradientToggle")}</Label>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Switch id="bg-gradient" checked={bgGradEnabled} onCheckedChange={setBgGradEnabled} disabled={bgTransparent} />
              <Label htmlFor="bg-gradient">{t("designerEditor.styleTab.backgroundGradientToggle")}</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
