"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Mp3UploadField({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState("");

  const onSelect = (e) => {
    setUploaded("");
    setError("");
    setFile(e.target.files?.[0] || null);
  };

  const onUpload = async () => {
    try {
      if (!file) return;
      setBusy(true);
      setError("");
      const res = await fetch('/api/upload/mp3', {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'audio/mpeg', 'x-filename': file.name || 'audio.mp3' },
        body: file,
      });
      const js = await res.json().catch(() => ({}));
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
    <div className="space-y-2">
      <Label className="mb-1 block">Upload MP3</Label>
      <div className="flex items-center gap-2">
        <Input type="file" accept="audio/*" onChange={onSelect} />
        <Button type="button" variant="outline" disabled={!file || busy} onClick={onUpload}>{busy ? 'Uploading…' : 'Upload'}</Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {uploaded && <p className="text-xs mt-1">Uploaded to: {uploaded}</p>}
    </div>
  );
}

