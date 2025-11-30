"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ExportActions({
  t,
  onDownload,
  onDownloadPDF,
  qrName,
  setQrName,
  saveQrToDb,
  savingDb,
  savedQr,
}) {
  return (
    <>
      <div className="w-full flex flex-wrap items-center justify-center gap-3 py-3">
        <Button
          onClick={() => onDownload?.('png')}
          className=" text-xs"
        >
          {t("designerEditor.logoTab.downloadPng")}
        </Button>
        <Button
          variant="outline"
          onClick={() => onDownload?.('svg')}
          className=" text-xs"
        >
          {t("designerEditor.logoTab.downloadSvg")}
        </Button>
        <Button
          variant="outline"
          onClick={() => onDownloadPDF?.()}
          className=" text-xs"
        >
          {t("designerEditor.logoTab.downloadPdf")}
        </Button>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.saveToLibrary")}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
          <div className="lg:col-span-2">
            <Label className="mb-2 block text-sm">{t("designerEditor.qrName")}</Label>
            <Input
              value={qrName}
              onChange={(e) => setQrName?.(e.target.value)}
              placeholder={t("designerEditor.qrNamePlaceholder")}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={saveQrToDb} disabled={savingDb} className="w-full text-xs">
              {savingDb ? t("designerEditor.saving") : t("designerEditor.saveQr")}
            </Button>
            {/*{savedQr?.slug && (*/}
            {/*  <a className="text-sm text-center underline text-muted-foreground hover:text-foreground transition-colors" href="/qrs">*/}
            {/*    {t("designerEditor.viewInMyQrs")}*/}
            {/*  </a>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    </>
  );
}

