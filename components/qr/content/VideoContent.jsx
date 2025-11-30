"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import VideoUploadField from "@/components/qr/content/VideoUploadField";
import ImageUploadField from "@/components/qr/content/ImageUploadField";
import { Globe, Youtube, Instagram, Facebook, Music2, Film, Tv } from "lucide-react";

export default function VideoContent({
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
  mediaCover, setMediaCover,
  pdfRequirePassword, setPdfRequirePassword,
  pdfPassword, setPdfPassword,
  videoSocialLinks = [], setVideoSocialLinks = () => {},
}) {
  const platforms = [
    { key: 'web', label: 'Web', icon: Globe },
    { key: 'youtube', label: 'YouTube', icon: Youtube },
    { key: 'vimeo', label: 'Vimeo', icon: Film },
    { key: 'tiktok', label: 'TikTok', icon: Music2 },
    { key: 'instagram', label: 'Instagram', icon: Instagram },
    { key: 'facebook', label: 'Facebook', icon: Facebook },
    { key: 'tv', label: 'TV', icon: Tv },
  ];
  const exists = (k) => (videoSocialLinks||[]).some(x => (x?.platform||'') === k);
  const addPlatform = (k) => {
    if (exists(k)) return;
    setVideoSocialLinks([...(videoSocialLinks||[]), { platform: k, url: '', text: '' }].slice(0,6));
  };
  const updateItem = (i, patch) => {
    const next = (videoSocialLinks||[]).slice();
    next[i] = { ...(next[i]||{}), ...patch };
    setVideoSocialLinks(next);
  };
  const removeItem = (i) => {
    const next = (videoSocialLinks||[]).slice();
    next.splice(i,1);
    setVideoSocialLinks(next);
  };
  return (
    <div className="space-y-3">
      <VideoUploadField onUploaded={(url) => setLinkUrl(url)} />

      <div className="space-y-2">
        <Label className="mb-1 block">Cover image (poster)</Label>
        <ImageUploadField onUploaded={(url) => setMediaCover(url)} />
        <Input className="mt-2" placeholder="https://... (image URL)" value={mediaCover} onChange={(e) => setMediaCover(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="video-title">Title</Label>
          <Input id="video-title" value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Video title" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="video-cta">Button text</Label>
          <Input id="video-cta" value={pdfCtaText} onChange={(e) => setPdfCtaText(e.target.value)} placeholder={t("designerEditor.contentTab.openButton", "Watch")} />
        </div>
      </div>

      <div>
        <Label className="mb-1 block" htmlFor="video-desc">Description</Label>
        <Textarea id="video-desc" value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description..." rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground mt-1">{(pdfDescription?.length || 0)} / 4000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="video-website">Website</Label>
          <Input id="video-website" value={pdfWebsite} onChange={(e) => setPdfWebsite(e.target.value)} placeholder="https://mysite.com" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="video-open">Open behavior</Label>
          <Select value={pdfOpenTarget} onValueChange={setPdfOpenTarget}>
            <SelectTrigger className="w-full" id="video-open"><SelectValue/></SelectTrigger>
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
          <Label className="mb-1 block" htmlFor="video-title-font">Title font</Label>
          <Select value={pdfTitleFont} onValueChange={setPdfTitleFont}>
            <SelectTrigger className="w-full" id="video-title-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="video-text-font">Texts font</Label>
          <Select value={pdfTextFont} onValueChange={setPdfTextFont}>
            <SelectTrigger className="w-full" id="video-text-font"><SelectValue/></SelectTrigger>
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
          <Label className="mb-1 block" htmlFor="video-accent">Primary color</Label>
          <Input id="video-accent" type="color" value={pdfAccent} onChange={(e) => setPdfAccent(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="video-accent2">Secondary color</Label>
          <Input id="video-accent2" type="color" value={pdfAccent2 || "#000000"} onChange={(e) => setPdfAccent2(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="video-style">Landing design</Label>
          <Select value={pdfStyle} onValueChange={setPdfStyle}>
            <SelectTrigger className="w-full" id="video-style"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="cover">Cover</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="mb-1 block">Social links</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {platforms.map(p => (
            <button key={p.key} type="button" onClick={() => addPlatform(p.key)} disabled={exists(p.key)}
                    className={`rounded-xl border p-3 flex items-center gap-2 text-left hover:bg-black/5 dark:hover:bg-white/5 ${exists(p.key) ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <p.icon className="w-4 h-4"/>
              <span className="text-sm font-medium">{p.label}</span>
            </button>
          ))}
        </div>

        {(videoSocialLinks||[]).length > 0 && (
          <div className="space-y-2">
            {(videoSocialLinks||[]).map((item, i) => {
              const PIcon = platforms.find(p => p.key === item.platform)?.icon || Globe;
              const name = platforms.find(p => p.key === item.platform)?.label || (item.platform || 'Link');
              return (
                <div key={i} className="rounded-xl border border-black/10 p-3 bg-white/70 dark:bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <PIcon className="w-4 h-4"/>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="ml-auto">
                      <button type="button" className="text-xs text-red-600 underline" onClick={() => removeItem(i)}>Remove</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-2">
                      <Label className="text-xs">URL</Label>
                      <Input value={item.url || ''} onChange={(e) => updateItem(i, { url: e.target.value })} placeholder="https://..."/>
                    </div>
                    <div>
                      <Label className="text-xs">Text</Label>
                      <Input value={item.text || ''} onChange={(e) => updateItem(i, { text: e.target.value })} placeholder="Follow us"/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div className="flex items-center gap-2 mt-2">
          <Switch checked={pdfRequirePassword} onCheckedChange={setPdfRequirePassword} id="video-pw" />
          <Label htmlFor="video-pw">Activate password to access the video.</Label>
        </div>
        {pdfRequirePassword && (
          <div>
            <Label className="mb-1 block" htmlFor="video-password">Password</Label>
            <Input id="video-password" type="password" value={pdfPassword} onChange={(e) => setPdfPassword(e.target.value)} placeholder="Enter password" />
          </div>
        )}
      </div>
    </div>
  );
}
