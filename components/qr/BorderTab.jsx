"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { Type, Image as ImageIcon, Palette } from "lucide-react";

export default function BorderTab({

  circularBorder, setCircularBorder,
  borderText, setBorderText,
  borderTextColor, setBorderTextColor,
  borderFont, setBorderFont,
  borderFontSize, setBorderFontSize,
  borderLogo, setBorderLogo,
  borderLogoSize, setBorderLogoSize,
  borderLogoAngle, setBorderLogoAngle,
  patternColor, setPatternColor,
  ringBackgroundColor, setRingBackgroundColor,
  innerBorderWidth, setInnerBorderWidth,
  innerBorderColor, setInnerBorderColor,
  outerBorderWidth, setOuterBorderWidth,
  outerBorderColor, setOuterBorderColor,
  innerRadius, setInnerRadius,
  outerRadius, setOuterRadius,

  onBorderLogoUpload,
  onRemoveBorderLogo
}) {
  const { t } = useTranslation("common", { keyPrefix: "designerEditor.borderTab" });

  const fontOptions = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS'
  ];

  return (
    <div className="space-y-6">
      {/* Circular Border Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <Label className="font-medium text-sm">
            {t("circularBorder")}
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            {t("circularBorderDesc")}
          </p>
        </div>
        <Switch 
          checked={circularBorder} 
          onCheckedChange={setCircularBorder}
        />
      </div>

      {/* Circular Border Controls */}
      {circularBorder && (
        <>
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">
              {t("circularSettings")}
            </h4>

            {/* Ring Background Color */}
            <div className="mb-6">
              <Label className="block mb-2 flex items-center gap-2">
                {t("ringBackground")}
              </Label>
              <Input
                type="color"
                value={ringBackgroundColor}
                onChange={(e) => setRingBackgroundColor(e.target.value)}
                className="h-10 w-32 cursor-pointer"
              />
            </div>

            {/* Radius Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="block mb-1 text-sm">
                  {t("innerRadius")}: {innerRadius}px
                </Label>
                <Slider
                  min={0}
                  max={200}
                  value={[innerRadius]}
                  onValueChange={(v) => setInnerRadius(v?.[0] ?? 0)}
                />
              </div>
              <div>
                <Label className="block mb-1 text-sm">
                  {t("outerRadius")}: {outerRadius}px
                </Label>
                <Slider
                  min={0}
                  max={200}
                  value={[outerRadius]}
                  onValueChange={(v) => setOuterRadius(v?.[0] ?? 0)}
                />
              </div>
            </div>

            {/* Border Widths and Colors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="block mb-1 text-sm">
                  {t("innerBorderWidth")}: {innerBorderWidth}px
                </Label>
                <Slider
                  min={0}
                  max={100}
                  value={[innerBorderWidth]}
                  onValueChange={(v) => setInnerBorderWidth(v?.[0] ?? 0)}
                />
              </div>
              <div>
                <Label className="block mb-1 text-sm">
                  {t("innerBorderColor")}
                </Label>
                <Input
                  type="color"
                  value={innerBorderColor}
                  onChange={(e) => setInnerBorderColor(e.target.value)}
                  className="h-10 w-full cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="block mb-1 text-sm">
                  {t("outerBorderWidth")}: {outerBorderWidth}px
                </Label>
                <Slider
                  min={0}
                  max={100}
                  value={[outerBorderWidth]}
                  onValueChange={(v) => setOuterBorderWidth(v?.[0] ?? 0)}
                />
              </div>
              <div>
                <Label className="block mb-1 text-sm">
                  {t("outerBorderColor")}
                </Label>
                <Input
                  type="color"
                  value={outerBorderColor}
                  onChange={(e) => setOuterBorderColor(e.target.value)}
                  className="h-10 w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Pattern Color */}
            <div className="mb-6">
              <Label className="block mb-2 flex items-center gap-2">
                <Palette className="size-4" />
                {t("patternColor")}
              </Label>
              <Input 
                type="color" 
                value={patternColor} 
                onChange={(e) => setPatternColor(e.target.value)} 
                className="h-10 w-32 cursor-pointer" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("patternColorDesc")}
              </p>
            </div>

            {/* Border Text Settings */}
            <div className="space-y-4 mb-6">
              <Label className="block font-medium flex items-center gap-2">
                <Type className="size-4" />
                {t("borderText")}
              </Label>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-1 text-sm">
                    {t("textContent")}
                  </Label>
                  <Input
                    type="text"
                    value={borderText}
                    onChange={(e) => setBorderText(e.target.value)}
                    placeholder={t("textPlaceholder")}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label className="block mb-1 text-sm">
                    {t("textColor")}
                  </Label>
                  <Input 
                    type="color" 
                    value={borderTextColor} 
                    onChange={(e) => setBorderTextColor(e.target.value)} 
                    className="h-10 w-full cursor-pointer" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-1 text-sm">
                    {t("font")}
                  </Label>
                  <Select value={borderFont} onValueChange={setBorderFont}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block mb-1 text-sm">
                    {t("fontSize")}: {borderFontSize}px
                  </Label>
                  <Slider 
                    min={8} 
                    max={24} 
                    value={[borderFontSize]} 
                    onValueChange={(v) => setBorderFontSize(v?.[0] ?? 14)} 
                  />
                </div>
              </div>
            </div>

            {/* Border Logo Settings */}
            <div className="space-y-4">
              <Label className="block font-medium flex items-center gap-2">
                <ImageIcon className="size-4" />
                {t("borderLogo")}
              </Label>
              
              <div>
                <Label className="block mb-1 text-sm">
                  {t("uploadLogo")}
                </Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={onBorderLogoUpload}
                  className="w-full"
                />
                
                {borderLogo && (
                  <div className="flex items-center gap-3 mt-3 p-3 bg-muted/30 rounded-lg">
                    <img 
                      src={borderLogo} 
                      alt="border logo"
                      className="h-8 w-8 object-contain rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t("logoUploaded")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("logoReady")}
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={onRemoveBorderLogo}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                )}
              </div>
              
              {borderLogo && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-1 text-sm">
                      {t("logoSize")}: {borderLogoSize}px
                    </Label>
                    <Slider 
                      min={16} 
                      max={48} 
                      value={[borderLogoSize]} 
                      onValueChange={(v) => setBorderLogoSize(v?.[0] ?? 24)} 
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-1 text-sm">
                      {t("logoAngle")}: {borderLogoAngle}°
                    </Label>
                    <Slider 
                      min={0} 
                      max={360} 
                      value={[borderLogoAngle]} 
                      onValueChange={(v) => setBorderLogoAngle(v?.[0] ?? 0)} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
