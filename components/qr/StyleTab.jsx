"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette, Shapes, Maximize2 } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1 flex flex-wrap items-center gap-2"><Maximize2 className="size-4"/> Size: {size}px</Label>
          <Slider min={128} max={512} value={[size]} onValueChange={(val) => setSize(val?.[0] ?? 256)} />
        </div>
        <div className="min-w-0">
          <Label className="block mb-1 flex flex-wrap items-center gap-2"><Maximize2 className="size-4"/> Quiet zone: {quietZone}px</Label>
          <Slider min={0} max={32} value={[quietZone]} onValueChange={(val) => setQuietZone(val?.[0] ?? 4)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1">Error correction</Label>
          <Select value={errorCorrection} onValueChange={setErrorCorrection}>
            <SelectTrigger className="w-full truncate"><SelectValue placeholder="Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L (Lowest)</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="Q">Q</SelectItem>
              <SelectItem value="H">H (Highest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="min-w-0">
          <Label className="block mb-1 flex flex-wrap items-center gap-2"><Shapes className="size-4"/> Dots type</Label>
          <Select value={dotType} onValueChange={setDotType}>
            <SelectTrigger className="w-full truncate"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              {dotTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!dotGradEnabled && (
          <div className="min-w-0">
            <label className="block text-sm font-medium mb-1 flex flex-wrap items-center gap-2"><Palette className="size-4"/> Dots color</label>
            <Input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="h-10 w-full cursor-pointer" />
          </div>
        )}
        {dotGradEnabled && (
          <div className="space-y-2 min-w-0">
            <label className="block text-sm font-medium flex flex-wrap items-center gap-2"><Palette className="size-4"/> Dots gradient</label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="color" value={dotGradStart} onChange={(e) => setDotGradStart(e.target.value)} />
              {dotGradStops === 3 ? (
                <Input type="color" value={dotGradMid} onChange={(e) => setDotGradMid(e.target.value)} />
              ) : (
                <div />
              )}
              <Input type="color" value={dotGradEnd} onChange={(e) => setDotGradEnd(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={dotGradType} onValueChange={setDotGradType}>
                <SelectTrigger className="w-full truncate"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
              <div className="min-w-0">
                <Label className="block text-xs mb-1">Rotation (radians)</Label>
                <Input type="number" step={0.1} value={dotGradRotation} onChange={(e) => setDotGradRotation(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <RadioGroup className="flex items-center gap-3 text-xs" value={String(dotGradStops)} onValueChange={(v) => setDotGradStops(parseInt(v, 10))}>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="dotstops-2" value="2" />
                <Label htmlFor="dotstops-2">2 stops</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="dotstops-3" value="3" />
                <Label htmlFor="dotstops-3">3 stops</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1 flex flex-wrap items-center gap-2"><Palette className="size-4"/> Background</label>
          {!bgGradEnabled && (
            <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full cursor-pointer" disabled={bgTransparent} />
          )}
          {bgGradEnabled && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input type="color" value={bgGradStart} onChange={(e) => setBgGradStart(e.target.value)} disabled={bgTransparent} />
                {bgGradStops === 3 ? (
                  <Input type="color" value={bgGradMid} onChange={(e) => setBgGradMid(e.target.value)} disabled={bgTransparent} />
                ) : (
                  <div />
                )}
                <Input type="color" value={bgGradEnd} onChange={(e) => setBgGradEnd(e.target.value)} disabled={bgTransparent} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={bgGradType} onValueChange={setBgGradType} disabled={bgTransparent}>
                  <SelectTrigger className="w-full truncate"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                  </SelectContent>
                </Select>
                <div className="min-w-0">
                  <Label className="block text-xs mb-1">Rotation (radians)</Label>
                  <Input type="number" step={0.1} value={bgGradRotation} onChange={(e) => setBgGradRotation(parseFloat(e.target.value) || 0)} disabled={bgTransparent} />
                </div>
              </div>
              <RadioGroup className="flex items-center gap-3 text-xs" value={String(bgGradStops)} onValueChange={(v) => setBgGradStops(parseInt(v, 10))} disabled={bgTransparent}>
                <div className="flex items-center gap-2 text-xs">
                  <RadioGroupItem id="bgstops-2" value="2" />
                  <Label htmlFor="bgstops-2">2 stops</Label>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <RadioGroupItem id="bgstops-3" value="3" />
                  <Label htmlFor="bgstops-3">3 stops</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          <div className="flex flex-row sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs">
              <Switch id="bg-transparent" checked={bgTransparent} onCheckedChange={setBgTransparent} />
              <Label htmlFor="bg-transparent">Transparent</Label>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Switch id="dots-gradient" checked={dotGradEnabled} onCheckedChange={setDotGradEnabled} />
              <Label htmlFor="dots-gradient">Dots gradient</Label>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Switch id="bg-gradient" checked={bgGradEnabled} onCheckedChange={setBgGradEnabled} disabled={bgTransparent} />
              <Label htmlFor="bg-gradient">Background gradient</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

