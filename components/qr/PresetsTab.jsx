"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function PresetsTab({
  presetName, setPresetName,
  savedPresets,
  selectedPresetId, setSelectedPresetId,
  savePreset, loadPreset, deletePreset,
}) {
  const { t } = useTranslation("common");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div className="min-w-0">
          <Label className="mb-1 block flex flex-wrap items-center gap-2"><Save className="size-4"/> {t("designerEditor.presetsTab.savePresetNameLabel")}</Label>
          <Input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder={t("designerEditor.presetsTab.presetNamePlaceholder")} />
        </div>
        <Button type="button" variant="outline" className="w-full md:w-auto" onClick={savePreset}>{t("designerEditor.presetsTab.savePresetButton")}</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div className="md:col-span-2 min-w-0">
          <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
            <SelectTrigger className="w-full truncate"><SelectValue placeholder={t("designerEditor.presetsTab.selectPresetPlaceholder")} /></SelectTrigger>
            <SelectContent>
              {(!savedPresets || savedPresets.length === 0) && (
                <SelectItem value="" disabled>{t("designerEditor.presetsTab.noPresets")}</SelectItem>
              )}
              {savedPresets?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button type="button" variant="outline" className="flex-1 md:flex-none" onClick={loadPreset}>{t("designerEditor.presetsTab.loadButton")}</Button>
          <Button type="button" variant="outline" className="flex-1 md:flex-none" onClick={deletePreset}>{t("designerEditor.presetsTab.deleteButton")}</Button>
        </div>
      </div>
    </div>
  );
}
