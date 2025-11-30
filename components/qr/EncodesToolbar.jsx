"use client";

import { Button } from "@/components/ui/button";

export default function EncodesToolbar({
  contentSource,
  setContentSource,
  viewerKind,
  setViewerKind,
  mode,
  setLandingUrl,
  buildPreviewUrl,
  ensureRedirectUrl,
}) {
  return (
    <div className="w-full flex items-center justify-center  gap-1 text-xs text-muted-foreground">
      <Button
        type="button"
        size="sm"
        variant={contentSource === 'direct' ? 'default' : 'outline'}
        onClick={() => { setContentSource('direct'); setViewerKind('qr'); }}
      >
        Direct content
      </Button>
      <Button
        type="button"
        size="sm"
        variant={contentSource === 'redirect' ? 'default' : 'outline'}
        onClick={async () => {
          await ensureRedirectUrl?.();
          setContentSource('redirect');
          setViewerKind('qr');
        }}
      >
        Redirect URL
      </Button>
      <Button
        type="button"
        size="sm"
        variant={viewerKind === 'preview' ? 'default' : 'outline'}
        onClick={() => {
          const url = buildPreviewUrl?.(mode) || '';
          setLandingUrl(url);
          setViewerKind('preview');
        }}
      >
        Preview
      </Button>
    </div>
  );
}

