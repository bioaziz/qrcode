"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadField from "@/components/qr/content/ImageUploadField";

export default function ImageContent({
  t,
  linkUrl, setLinkUrl,
  pdfTitle, setPdfTitle,
  pdfDescription, setPdfDescription,
  pdfWebsite, setPdfWebsite,
  pdfCtaText, setPdfCtaText,
  pdfOpenTarget, setPdfOpenTarget,
  pdfTitleFont, setPdfTitleFont,
  pdfTextFont, setPdfTextFont,
  pdfStyle, setPdfStyle,
  pdfAccent, setPdfAccent,
  pdfAccent2, setPdfAccent2,
}) {
  return (
    <div className="space-y-3">
      <ImageUploadField onUploaded={(url) => setLinkUrl(url)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="img-title">Title</Label>
          <Input id="img-title" value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Image title" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="img-cta">Button text</Label>
          <Input id="img-cta" value={pdfCtaText} onChange={(e) => setPdfCtaText(e.target.value)} placeholder={t("designerEditor.contentTab.openButton", "Open")} />
        </div>
      </div>

      <div>
        <Label className="mb-1 block" htmlFor="img-desc">Description</Label>
        <Textarea id="img-desc" value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description..." rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground mt-1">{(pdfDescription?.length || 0)} / 4000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="img-website">Website</Label>
          <Input id="img-website" value={pdfWebsite} onChange={(e) => setPdfWebsite(e.target.value)} placeholder="https://mysite.com" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="img-open">Open behavior</Label>
          <Select value={pdfOpenTarget} onValueChange={setPdfOpenTarget}>
            <SelectTrigger className="w-full" id="img-open"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="newtab">Open in new tab</SelectItem>
              <SelectItem value="sametab">Open in same tab</SelectItem>
              <SelectItem value="download">Download file</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="img-title-font">Title font</Label>
          <Select value={pdfTitleFont} onValueChange={setPdfTitleFont}>
            <SelectTrigger className="w-full" id="img-title-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="img-text-font">Texts font</Label>
          <Select value={pdfTextFont} onValueChange={setPdfTextFont}>
            <SelectTrigger className="w-full" id="img-text-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="img-accent">Primary color</Label>
          <Input id="img-accent" type="color" value={pdfAccent} onChange={(e) => setPdfAccent(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="img-accent2">Secondary color</Label>
          <Input id="img-accent2" type="color" value={pdfAccent2 || "#000000"} onChange={(e) => setPdfAccent2(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="img-style">Landing design</Label>
          <Select value={pdfStyle} onValueChange={setPdfStyle}>
            <SelectTrigger className="w-full" id="img-style"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="cover">Cover</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
