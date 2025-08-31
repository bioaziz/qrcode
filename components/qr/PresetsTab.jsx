"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function PresetsTab({
  presetName, setPresetName,
  savedPresets,
  selectedPresetId, setSelectedPresetId,
  savePreset, loadPreset, deletePreset,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block flex items-center gap-2"><Save className="size-4"/> Save preset name</Label>
          <Input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="My preset" />
        </div>
        <Button type="button" variant="outline" onClick={savePreset}>Save Preset</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div className="md:col-span-2">
          <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select saved preset" /></SelectTrigger>
            <SelectContent>
              {(!savedPresets || savedPresets.length === 0) && (
                <SelectItem value="" disabled>No saved presets</SelectItem>
              )}
              {savedPresets?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={loadPreset}>Load</Button>
          <Button type="button" variant="outline" onClick={deletePreset}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

