"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PdfUploadField({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState("");

  const onSelect = (e) => {
    const f = e.target.files?.[0];
    setError("");
    setUploaded("");
    if (!f) { setFile(null); return; }
    if (!f.type.includes('pdf')) { setError('Please select a PDF file.'); setFile(null); return; }
    if (f.size > 100 * 1024 * 1024) { setError('File too large (max 100MB).'); setFile(null); return; }
    setFile(f);
  };

  const onUpload = async () => {
    if (!file) { setError('File selection required'); return; }
    try {
      setBusy(true);
      setError("");
      const res = await fetch('/api/upload/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf', 'x-filename': file.name || 'file.pdf' },
        body: await file.arrayBuffer()
      });
      const js = await res.json();
      if (!res.ok || !js?.success) throw new Error(js?.message || 'Upload failed');
      setUploaded(js.url);
      onUploaded?.(js.url);
    } catch (e) {
      setError(e.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label className="mb-1 block">Upload PDF</Label>
      <div className="flex items-center gap-2">
        <Input type="file" accept="application/pdf,.pdf" onChange={onSelect} />
        <Button type="button" variant="outline" disabled={!file || busy} onClick={onUpload}>{busy ? 'Uploading…' : 'Upload'}</Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Maximum size: 100MB</p>
      {file ? <p className="text-xs mt-1">{file.name}</p> : <p className="text-xs mt-1">No file chosen</p>}
      {uploaded && <p className="text-xs mt-1">Uploaded to: {uploaded}</p>}
      {error && <p className="text-xs text-amber-600 mt-1">{error}</p>}
    </div>
  );
}

