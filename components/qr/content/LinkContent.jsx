"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link as LinkIcon } from "lucide-react";

export default function LinkContent({
  t,
  linkUrl, setLinkUrl,
  pdfTitle, setPdfTitle,
  pdfDescription, setPdfDescription,
  pdfCtaText, setPdfCtaText,
  pdfTitleFont, setPdfTitleFont,
  pdfTextFont, setPdfTextFont,
  pdfStyle, setPdfStyle,
  pdfAccent, setPdfAccent,
  pdfAccent2, setPdfAccent2,
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1 flex items-center gap-2" htmlFor="link-url"><LinkIcon className="size-4"/> {t("designerEditor.contentTab.url")}</Label>
        <Input id="link-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={t("designerEditor.contentTab.urlPlaceholder")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block">Title</Label>
          <Input value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Link title" />
        </div>
        <div>
          <Label className="mb-1 block">Button text</Label>
          <Input value={pdfCtaText} onChange={(e) => setPdfCtaText(e.target.value)} placeholder={t("designerEditor.contentTab.openButton", "Open")} />
        </div>
      </div>

      <div>
        <Label className="mb-1 block">Description</Label>
        <Textarea value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description..." rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground mt-1">{(pdfDescription?.length || 0)} / 4000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block">Title font</Label>
          <Select value={pdfTitleFont} onValueChange={setPdfTitleFont}>
            <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Texts font</Label>
          <Select value={pdfTextFont} onValueChange={setPdfTextFont}>
            <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
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
          <Label className="mb-1 block">Primary color</Label>
          <Input type="color" value={pdfAccent} onChange={(e) => setPdfAccent(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block">Secondary color</Label>
          <Input type="color" value={pdfAccent2 || "#000000"} onChange={(e) => setPdfAccent2(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block">Landing design</Label>
          <Select value={pdfStyle} onValueChange={setPdfStyle}>
            <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

