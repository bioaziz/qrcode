"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Mp3UploadField from "@/components/qr/content/Mp3UploadField";
import ImageUploadField from "@/components/qr/content/ImageUploadField";
import { Globe, Youtube, Instagram, Facebook, Music2, Cloud } from "lucide-react";

export default function Mp3Content({
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
  mp3SocialLinks = [], setMp3SocialLinks = () => {},
}) {
  const platforms = [
    { key: 'web', label: 'Web', icon: Globe },
    { key: 'spotify', label: 'Spotify', icon: Music2 },
    { key: 'youtube', label: 'YouTube', icon: Youtube },
    { key: 'soundcloud', label: 'SoundCloud', icon: Cloud },
    { key: 'tiktok', label: 'TikTok', icon: Music2 },
    { key: 'instagram', label: 'Instagram', icon: Instagram },
    { key: 'facebook', label: 'Facebook', icon: Facebook },
  ];
  const exists = (k) => (mp3SocialLinks||[]).some(x => (x?.platform||'') === k);
  const addPlatform = (k) => {
    if (exists(k)) return;
    setMp3SocialLinks([...(mp3SocialLinks||[]), { platform: k, url: '', text: '' }].slice(0,6));
  };
  const updateItem = (i, patch) => {
    const next = (mp3SocialLinks||[]).slice();
    next[i] = { ...(next[i]||{}), ...patch };
    setMp3SocialLinks(next);
  };
  const removeItem = (i) => {
    const next = (mp3SocialLinks||[]).slice();
    next.splice(i,1);
    setMp3SocialLinks(next);
  };
  return (
    <div className="space-y-3">
      <Mp3UploadField onUploaded={(url) => setLinkUrl(url)} />

      <div className="space-y-2">
        <Label className="mb-1 block">Cover image</Label>
        <ImageUploadField onUploaded={(url) => setMediaCover(url)} />
        <Input className="mt-2" placeholder="https://... (image URL)" value={mediaCover} onChange={(e) => setMediaCover(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="mp3-title">Title</Label>
          <Input id="mp3-title" value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="Track title" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="mp3-cta">Button text</Label>
          <Input id="mp3-cta" value={pdfCtaText} onChange={(e) => setPdfCtaText(e.target.value)} placeholder={t("designerEditor.contentTab.playButton", "Play")} />
        </div>
      </div>

      <div>
        <Label className="mb-1 block" htmlFor="mp3-desc">Description</Label>
        <Textarea id="mp3-desc" value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} placeholder="Short description..." rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground mt-1">{(pdfDescription?.length || 0)} / 4000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="mp3-website">Website</Label>
          <Input id="mp3-website" value={pdfWebsite} onChange={(e) => setPdfWebsite(e.target.value)} placeholder="https://mysite.com" />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="mp3-open">Open behavior</Label>
          <Select value={pdfOpenTarget} onValueChange={setPdfOpenTarget}>
            <SelectTrigger className="w-full" id="mp3-open"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="newtab">Open in new tab</SelectItem>
              <SelectItem value="sametab">Open in same tab</SelectItem>
              <SelectItem value="download">Download file</SelectItem>
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

        {(mp3SocialLinks||[]).length > 0 && (
          <div className="space-y-2">
            {(mp3SocialLinks||[]).map((item, i) => {
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
                      <Input value={item.text || ''} onChange={(e) => updateItem(i, { text: e.target.value })} placeholder="Listen on"/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="mb-1 block" htmlFor="mp3-title-font">Title font</Label>
          <Select value={pdfTitleFont} onValueChange={setPdfTitleFont}>
            <SelectTrigger className="w-full" id="mp3-title-font"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="GT Walsheim Pro">GT Walsheim Pro</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block" htmlFor="mp3-text-font">Texts font</Label>
          <Select value={pdfTextFont} onValueChange={setPdfTextFont}>
            <SelectTrigger className="w-full" id="mp3-text-font"><SelectValue/></SelectTrigger>
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
          <Label className="mb-1 block" htmlFor="mp3-accent">Primary color</Label>
          <Input id="mp3-accent" type="color" value={pdfAccent} onChange={(e) => setPdfAccent(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="mp3-accent2">Secondary color</Label>
          <Input id="mp3-accent2" type="color" value={pdfAccent2 || "#000000"} onChange={(e) => setPdfAccent2(e.target.value)}/>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1 block" htmlFor="mp3-style">Landing design</Label>
          <Select value={pdfStyle} onValueChange={setPdfStyle}>
            <SelectTrigger className="w-full" id="mp3-style"><SelectValue/></SelectTrigger>
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
          <Switch checked={pdfRequirePassword} onCheckedChange={setPdfRequirePassword} id="mp3-pw" />
          <Label htmlFor="mp3-pw">Activate password to access the audio.</Label>
        </div>
        {pdfRequirePassword && (
          <div>
            <Label className="mb-1 block" htmlFor="mp3-password">Password</Label>
            <Input id="mp3-password" type="password" value={pdfPassword} onChange={(e) => setPdfPassword(e.target.value)} placeholder="Enter password" />
          </div>
        )}
      </div>
    </div>
  );
}
