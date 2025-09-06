"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Square as SquareIcon, Circle } from "lucide-react";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";

export default function CornersTab({
  cornerSquareType, setCornerSquareType,
  cornerSquareColor, setCornerSquareColor,
  cornerDotType, setCornerDotType,
  cornerDotColor, setCornerDotColor,
  cornerSquareTypes,
  cornerDotTypes,
}) {
  const { t } = useTranslation("common");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <Label className="block mb-1 flex items-center gap-2"><SquareIcon className="size-4"/> {t("designerEditor.cornersTab.cornerSquareLabel")}</Label>
        <RadioGroup value={cornerSquareType} onValueChange={setCornerSquareType} className="grid grid-cols-2 gap-2">
          {cornerSquareTypes.map((type) => (
            <label key={type} htmlFor={`cs-${type}`} className={cn(
              "flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer",
              "hover:bg-black/5 transition-colors",
              cornerSquareType === type ? "ring-2 ring-black border-black" : "border-black/20"
            )}>
              <RadioGroupItem id={`cs-${type}`} value={type} className="sr-only" />
              <SquareIcon className="size-4" />
              <span className="truncate">{t(`designerEditor.cornersTab.cornerSquareTypes.${type}`)}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><SquareIcon className="size-4"/> {t("designerEditor.cornersTab.cornerSquareColorLabel")}</label>
        <ColorPicker value={cornerSquareColor} onChange={setCornerSquareColor} />
      </div>
      <div>
        <Label className="block mb-1 flex items-center gap-2"><Circle className="size-4"/> {t("designerEditor.cornersTab.cornerDotLabel")}</Label>
        <RadioGroup value={cornerDotType} onValueChange={setCornerDotType} className="grid grid-cols-2 gap-2">
          {cornerDotTypes.map((type) => (
            <label key={type} htmlFor={`cd-${type}`} className={cn(
              "flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer",
              "hover:bg-black/5 transition-colors",
              cornerDotType === type ? "ring-2 ring-black border-black" : "border-black/20"
            )}>
              <RadioGroupItem id={`cd-${type}`} value={type} className="sr-only" />
              <Circle className="size-4" />
              <span className="truncate">{t(`designerEditor.cornersTab.cornerDotTypes.${type}`)}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Circle className="size-4"/> {t("designerEditor.cornersTab.cornerDotColorLabel")}</label>
        <ColorPicker value={cornerDotColor} onChange={setCornerDotColor} />
      </div>
    </div>
  );
}
