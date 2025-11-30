"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import PdfUploadField from "@/components/qr/content/PdfUploadField";
// no cover image for PDF

export default function PdfContent({
  t,
  linkUrl, setLinkUrl,
  pdfDirect, setPdfDirect,
  pdfCompany, setPdfCompany,
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
  pdfRequirePassword, setPdfRequirePassword,
  pdfPassword, setPdfPassword,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <Switch checked={pdfDirect} onCheckedChange={setPdfDirect} id="pdf-direct"/>
        <Label htmlFor="pdf-direct">Directly show the PDF file.</Label>
      </div>

      <PdfUploadField onUploaded={(url) => setLinkUrl(url)} />

      {/* Cover image intentionally not supported for PDF */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="pdf-company">Company</Label>
          <Input id="pdf-company" value={pdfCompany} onChange={(e) => setPdfCompany(e.target.value)} placeholder="Acme Inc." />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="pdf-website">Website</Label>
          <Input id="pdf-website" value={pdfWebsite} onChange={(e) => setPdfWebsite(e.target.value)} placeholder="https://acme.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="pdf-title">Title</Label>
          <Input id="pdf-title" value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Product Brochure" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="pdf-cta">Button text</Label>
          <Input id="pdf-cta" value={pdfCtaText} onChange={(e) => setPdfCtaText(e.target.value)} placeholder={t("designerEditor.contentTab.viewPdfButton", "View PDF")} />
        </div>
      </div>

      <div>
        <Label className="mb-1 block" htmlFor="pdf-desc">Description</Label>
        <Textarea id="pdf-desc" value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description..." rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground mt-1">{(pdfDescription?.length || 0)} / 4000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="pdf-accent">Primary color</Label>
          <Input id="pdf-accent" type="color" value={pdfAccent} onChange={(e) => setPdfAccent(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="pdf-accent2">Secondary color</Label>
          <Input id="pdf-accent2" type="color" value={pdfAccent2 || "#000000"} onChange={(e) => setPdfAccent2(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="pdf-open">Open behavior</Label>
          <Select value={pdfOpenTarget} onValueChange={setPdfOpenTarget}>
            <SelectTrigger className="w-full" id="pdf-open"><SelectValue/></SelectTrigger>
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
          <Label className="mb-1 block" htmlFor="pdf-title-font">Title font</Label>
          <Select value={pdfTitleFont} onValueChange={setPdfTitleFont}>
            <SelectTrigger className="w-full" id="pdf-title-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="pdf-text-font">Texts font</Label>
          <Select value={pdfTextFont} onValueChange={setPdfTextFont}>
            <SelectTrigger className="w-full" id="pdf-text-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="pdf-style">Landing design</Label>
          <Select value={pdfStyle} onValueChange={setPdfStyle}>
            <SelectTrigger className="w-full" id="pdf-style"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="cover">Cover</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div className="flex items-center gap-2 mt-2">
          <Switch checked={pdfRequirePassword} onCheckedChange={setPdfRequirePassword} id="pdf-pw" />
          <Label htmlFor="pdf-pw">Activate password to access the QR code.</Label>
        </div>
        {pdfRequirePassword && (
          <div>
            <Label className="mb-1 block" htmlFor="pdf-password">Password</Label>
            <Input id="pdf-password" type="password" value={pdfPassword} onChange={(e) => setPdfPassword(e.target.value)} placeholder="Enter password" />
          </div>
        )}
      </div>
    </div>
  );
}
