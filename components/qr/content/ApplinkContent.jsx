"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function ApplinkContent({
  t,
  // URLs
  url, setUrl, // iOS
  street, setStreet, // Android
  city, setCity, // Web fallback
  // Presentation
  pdfTitle, setPdfTitle,
  pdfDescription, setPdfDescription,
  pdfTitleFont, setPdfTitleFont,
  pdfTextFont, setPdfTextFont,
  pdfStyle, setPdfStyle,
  pdfAccent, setPdfAccent,
  pdfAccent2, setPdfAccent2,
  // App specific
  appCtaIos, setAppCtaIos,
  appCtaAndroid, setAppCtaAndroid,
  appCtaWeb, setAppCtaWeb,
  appAutoRedirect, setAppAutoRedirect,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block">{t("designerEditor.contentTab.appIosUrl")}</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://apps.apple.com/..." />
        </div>
        <div>
          <Label className="mb-1 block">{t("designerEditor.contentTab.appAndroidUrl")}</Label>
          <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="https://play.google.com/store/apps/details?id=..." />
        </div>
      </div>

      <div>
        <Label className="mb-1 block">{t("designerEditor.contentTab.appWebUrl")}</Label>
        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("designerEditor.contentTab.urlPlaceholder")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="cta-ios">{t("designerEditor.contentTab.appCtaIos")}</Label>
          <Input id="cta-ios" value={appCtaIos} onChange={(e) => setAppCtaIos(e.target.value)} placeholder="App Store" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="cta-android">{t("designerEditor.contentTab.appCtaAndroid")}</Label>
          <Input id="cta-android" value={appCtaAndroid} onChange={(e) => setAppCtaAndroid(e.target.value)} placeholder="Google Play" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="cta-web">{t("designerEditor.contentTab.appCtaWeb")}</Label>
          <Input id="cta-web" value={appCtaWeb} onChange={(e) => setAppCtaWeb(e.target.value)} placeholder="Open Website" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Switch checked={appAutoRedirect} onCheckedChange={setAppAutoRedirect} id="app-auto"/>
        <Label htmlFor="app-auto">{t("designerEditor.contentTab.appAutoRedirect")}</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="app-title">Title</Label>
          <Input id="app-title" value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Get our app" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="app-title-font">Title font</Label>
          <Select value={pdfTitleFont} onValueChange={setPdfTitleFont}>
            <SelectTrigger className="w-full" id="app-title-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="mb-1 block" htmlFor="app-desc">Description</Label>
        <Textarea id="app-desc" value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description..." rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground mt-1">{(pdfDescription?.length || 0)} / 4000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="app-text-font">Texts font</Label>
          <Select value={pdfTextFont} onValueChange={setPdfTextFont}>
            <SelectTrigger className="w-full" id="app-text-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="app-style">Landing design</Label>
          <Select value={pdfStyle} onValueChange={setPdfStyle}>
            <SelectTrigger className="w-full" id="app-style"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="app-accent">Primary color</Label>
          <Input id="app-accent" type="color" value={pdfAccent} onChange={(e) => setPdfAccent(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="app-accent2">Secondary color</Label>
          <Input id="app-accent2" type="color" value={pdfAccent2 || "#000000"} onChange={(e) => setPdfAccent2(e.target.value)}/>
        </div>
      </div>
    </div>
  );
}
