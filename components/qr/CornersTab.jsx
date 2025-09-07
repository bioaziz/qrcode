"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Square as SquareIcon, Circle } from "lucide-react";
import { useTranslation } from "next-i18next";

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
        <Select value={cornerSquareType} onValueChange={setCornerSquareType}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t("designerEditor.cornersTab.cornerSquareTypePlaceholder")} /></SelectTrigger>
          <SelectContent>
            {cornerSquareTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`designerEditor.cornersTab.cornerSquareTypes.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><SquareIcon className="size-4"/> {t("designerEditor.cornersTab.cornerSquareColorLabel")}</label>
        <Input type="color" value={cornerSquareColor} onChange={(e) => setCornerSquareColor(e.target.value)} className="h-10 w-full cursor-pointer" />
      </div>
      <div>
        <Label className="block mb-1 flex items-center gap-2"><Circle className="size-4"/> {t("designerEditor.cornersTab.cornerDotLabel")}</Label>
        <Select value={cornerDotType} onValueChange={setCornerDotType}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t("designerEditor.cornersTab.cornerDotTypePlaceholder")} /></SelectTrigger>
          <SelectContent>
            {cornerDotTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`designerEditor.cornersTab.cornerDotTypes.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Circle className="size-4"/> {t("designerEditor.cornersTab.cornerDotColorLabel")}</label>
        <Input type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="h-10 w-full cursor-pointer" />
      </div>
    </div>
  );
}

