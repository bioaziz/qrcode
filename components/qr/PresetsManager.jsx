"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function PresetsManager({
  t,
  // Local presets
  savedPresets = [],
  presetName,
  setPresetName,
  selectedPresetId,
  setSelectedPresetId,
  onSaveLocal,
  onLoadLocal,
  onDeleteLocal,
  // Cloud presets
  buildSnapshot,
  applySnapshot,
  cloudPresets,
  refreshCloudPresets,
  cloudSelectedId,
  setCloudSelectedId,
}) {
  const onSaveCloud = async () => {
    try {
      const snapshot = buildSnapshot?.();
      const res = await fetch('/api/presets', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: presetName || t('designerEditor.untitled'), snapshot })
      });
      if (res.ok) toast.success(t("designerEditor.messages.presetSaved"));
      else toast.error(t("designerEditor.messages.failedToSave"));
    } catch (_) {
      toast.error(t("designerEditor.messages.failedToSave"));
    }
  };

  const onSelectCloud = async (id) => {
    try {
      setCloudSelectedId?.(id);
      if (!id) return;
      const r = await fetch(`/api/presets/${id}`);
      const js = await r.json();
      if (js?.success) applySnapshot?.(js.item.snapshot);
    } catch (_) {}
  };

  const onDeleteCloud = async () => {
    if (!cloudSelectedId) return;
    try {
      await fetch(`/api/presets/${cloudSelectedId}`, { method: 'DELETE' });
      refreshCloudPresets?.();
      setCloudSelectedId?.("");
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Local Presets Section */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.presetsTab.localTitle", "Local Presets")}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Save Local Preset */}
          <div className="space-y-3">
            <Label className="text-sm">{t("designerEditor.presetsTab.savePresetNameLabel", "Preset name")}</Label>
            <div className="flex gap-2">
              <Input
                value={presetName}
                onChange={(e) => setPresetName?.(e.target.value)}
                placeholder={t("designerEditor.presetsTab.presetNamePlaceholder")}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={onSaveLocal}>
                {t("designerEditor.presetsTab.savePresetButton", "Save preset")}
              </Button>
            </div>
          </div>

          {/* Load/Manage Local Presets */}
          <div className="space-y-3">
            <Label className="text-sm">{t("designerEditor.presetsTab.manageLabel", "Manage")}</Label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId?.(e.target.value)}
              >
                <option value="">
                  {savedPresets?.length ? t("designerEditor.presetsTab.selectPresetPlaceholder", "Select a preset") : t("designerEditor.presetsTab.noPresets", "No presets saved")}
                </option>
                {savedPresets?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name || p.id}</option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={onLoadLocal} disabled={!selectedPresetId}>
                {t("designerEditor.presetsTab.loadButton", "Load")}
              </Button>
              <Button type="button" variant="outline" onClick={onDeleteLocal} disabled={!selectedPresetId}>
                {t("designerEditor.presetsTab.deleteButton", "Delete")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Presets Section */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.presetsTab.cloudTitle")}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Save to Cloud */}
          <div className="space-y-3">
            <Label className="text-sm">{t("designerEditor.quickSave.cloudSaveLabel")}</Label>
            <div className="flex gap-2">
              <Input
                value={presetName}
                onChange={(e) => setPresetName?.(e.target.value)}
                placeholder={t("designerEditor.presetsTab.presetNamePlaceholder")}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={onSaveCloud}>
                {t("designerEditor.quickSave.saveToCloud")}
              </Button>
            </div>
          </div>

          {/* Load/Manage Cloud Presets */}
          <div className="space-y-3">
            <Label className="text-sm">{t("designerEditor.quickSave.cloudLoadLabel")}</Label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={cloudSelectedId}
                onChange={(e) => onSelectCloud(e.target.value)}
              >
                <option value="">{t("designerEditor.quickSave.selectCloudPreset")}</option>
                {cloudPresets?.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={onDeleteCloud} disabled={!cloudSelectedId}>
                {t("designerEditor.presetsTab.deleteButton")}
              </Button>
              <Button type="button" variant="outline" onClick={refreshCloudPresets}>
                {t("designerEditor.quickSave.refresh")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
