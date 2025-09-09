"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone as PhoneIcon,
  Link as LinkIcon,
  QrCode,
  Wifi as WifiIcon,
  Shield,
  MessageCircle,
  MessageSquare,
  File as FileIcon,
  Image as ImageIcon,
  Music,
  Video,
  Smartphone,
  MapPin,
  Map as MapIcon,
  User
} from "lucide-react";
import { useTranslation } from "next-i18next";

export default function ContentTab(props) {
  const {
    mode, setMode,
    data, setData,
    linkUrl, setLinkUrl,
    phone, setPhone,
    email, setEmail, emailSubject, setEmailSubject, emailBody, setEmailBody,
    firstName, setFirstName, lastName, setLastName, contactPhone, setContactPhone,
    contactEmail, setContactEmail, org, setOrg, url, setUrl, note, setNote,
    street, setStreet, city, setCity, state, setState, zip, setZip, country, setCountry,
    wifiSsid, setWifiSsid, wifiType, setWifiType, wifiPass, setWifiPass, wifiHidden, setWifiHidden,
    validation,
    copyContent, copyImage,
  } = props;

  const { t } = useTranslation("common");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label className="mb-2 flex items-center gap-2"><QrCode className="size-4"/> {t("designerEditor.contentTab.preset")}</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { key: "freeform", label: t("designerEditor.contentTab.freeform"), icon: QrCode },
              { key: "link", label: t("designerEditor.contentTab.link"), icon: LinkIcon },
              { key: "phone", label: t("designerEditor.contentTab.phone"), icon: PhoneIcon },
              { key: "email", label: t("designerEditor.contentTab.email"), icon: Mail },
              { key: "wifi", label: t("designerEditor.contentTab.wifi"), icon: WifiIcon },
              { key: "whatsapp", label: t("designerEditor.contentTab.whatsapp"), icon: MessageCircle },
              { key: "sms", label: t("designerEditor.contentTab.sms"), icon: MessageSquare },
              { key: "pdf", label: t("designerEditor.contentTab.pdf"), icon: FileIcon },
              { key: "image", label: t("designerEditor.contentTab.image"), icon: ImageIcon },
              { key: "mp3", label: t("designerEditor.contentTab.mp3"), icon: Music },
              { key: "video", label: t("designerEditor.contentTab.video"), icon: Video },
              { key: "app", label: t("designerEditor.contentTab.app"), icon: Smartphone },
              { key: "geo", label: t("designerEditor.contentTab.geo"), icon: MapPin },
              { key: "maps", label: t("designerEditor.contentTab.maps"), icon: MapIcon },
              { key: "mecard", label: t("designerEditor.contentTab.mecard"), icon: User },
              { key: "vcard", label: t("designerEditor.contentTab.vcard"), icon: User },
              { key: "social", label: t("designerEditor.contentTab.social"), icon: LinkIcon },
            ].map((p) => (
              <button key={p.key} type="button" onClick={() => setMode(p.key)} className={`text-left rounded-md border p-3 hover:bg-black/5 dark:hover:bg-white/5 transition ${mode === p.key ? 'border-black/40 dark:border-white/40' : 'border-black/10 dark:border-white/10'}`}>
                <div className="flex items-center gap-2">
                  <p.icon className="size-4" />
                  <div className="text-sm font-medium truncate">{p.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <Button variant="outline" onClick={copyContent}>{t("designerEditor.contentTab.copyContent")}</Button>
          <Button variant="outline" onClick={copyImage}>{t("designerEditor.contentTab.copyImage")}</Button>
        </div>
      </div>

      {mode === "freeform" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="freeform-content"><QrCode className="size-4"/> {t("designerEditor.contentTab.content")}</Label>
          <Input id="freeform-content" value={data} onChange={(e) => setData(e.target.value)} placeholder={t("designerEditor.contentTab.contentPlaceholder")} />
        </div>
      )}
      {mode === "link" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="link-url"><LinkIcon className="size-4"/> {t("designerEditor.contentTab.url")}</Label>
          <Input id="link-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={t("designerEditor.contentTab.urlPlaceholder")} />
        </div>
      )}
      {(mode === "pdf" || mode === "image" || mode === "mp3" || mode === "video" || mode === "maps") && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="media-url"><LinkIcon className="size-4"/> {t("designerEditor.contentTab.url")}</Label>
          <Input id="media-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={t("designerEditor.contentTab.urlPlaceholder")} />
        </div>
      )}
      {mode === "phone" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="phone"><PhoneIcon className="size-4"/> {t("designerEditor.contentTab.phoneLabel")}</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("designerEditor.contentTab.phonePlaceholder")} />
        </div>
      )}
      {mode === "email" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="email"><Mail className="size-4"/> {t("designerEditor.contentTab.emailLabel")}</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("designerEditor.contentTab.emailPlaceholder")} />
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 flex items-center gap-2" htmlFor="email-subject"><Mail className="size-4"/> {t("designerEditor.contentTab.subject")}</Label>
              <Input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder={t("designerEditor.contentTab.subjectPlaceholder")} />
            </div>
            <div>
              <Label className="mb-1 flex items-center gap-2" htmlFor="email-body"><Mail className="size-4"/> {t("designerEditor.contentTab.body")}</Label>
              <Input id="email-body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder={t("designerEditor.contentTab.bodyPlaceholder")} />
            </div>
          </div>
        </div>
      )}
      {mode === "whatsapp" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.whatsappPhone")}</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("designerEditor.contentTab.phonePlaceholder")} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.whatsappMessage")}</Label>
            <Input value={data} onChange={(e) => setData(e.target.value)} placeholder={t("designerEditor.contentTab.bodyPlaceholder")} />
          </div>
        </div>
      )}
      {mode === "sms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.smsPhone")}</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("designerEditor.contentTab.phonePlaceholder")} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.smsBody")}</Label>
            <Input value={data} onChange={(e) => setData(e.target.value)} placeholder={t("designerEditor.contentTab.bodyPlaceholder")} />
          </div>
        </div>
      )}
      {(mode === "mecard" || mode === "vcard") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.firstName")}</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.lastName")}</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.contactPhone")}</Label>
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.contactEmail")}</Label>
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.organization")}</Label>
            <Input value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.url")}</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">{t("designerEditor.contentTab.street")}</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.city")}</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.state")}</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.zip")}</Label>
            <Input value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.country")}</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">{t("designerEditor.contentTab.note")}</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      )}
      {mode === "wifi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 flex items-center gap-2" htmlFor="ssid"><WifiIcon className="size-4"/> {t("designerEditor.contentTab.ssid")}</Label>
            <Input id="ssid" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder={t("designerEditor.contentTab.ssidPlaceholder")} />
          </div>
          <div>
            <Label className="mb-1 flex items-center gap-2"><Shield className="size-4"/> {t("designerEditor.contentTab.security")}</Label>
            <Select value={wifiType} onValueChange={setWifiType}>
              <SelectTrigger className="w-full"><SelectValue placeholder={t("designerEditor.contentTab.securityPlaceholder")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">{t("designerEditor.contentTab.wpa")}</SelectItem>
                <SelectItem value="WEP">{t("designerEditor.contentTab.wep")}</SelectItem>
                <SelectItem value="nopass">{t("designerEditor.contentTab.nopass")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {wifiType !== "nopass" && (
            <div>
              <Label className="mb-1 flex items-center gap-2" htmlFor="wifi-pass"><Shield className="size-4"/> {t("designerEditor.contentTab.password")}</Label>
              <Input id="wifi-pass" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder={t("designerEditor.contentTab.passwordPlaceholder")} />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm mt-2">
            <Switch checked={wifiHidden} onCheckedChange={setWifiHidden} id="wifi-hidden" />
            <Label htmlFor="wifi-hidden">{t("designerEditor.contentTab.hiddenNetwork")}</Label>
          </div>
        </div>
      )}

      {mode === "app" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.appIosUrl")}</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://apps.apple.com/..." />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.appAndroidUrl")}</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="https://play.google.com/store/apps/details?id=..." />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">{t("designerEditor.contentTab.appWebUrl")}</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("designerEditor.contentTab.urlPlaceholder")} />
          </div>
        </div>
      )}

      {mode === "geo" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.geoLat")}</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="6.3703" />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.geoLng")}</Label>
            <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="2.3912" />
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.geoLabel")}</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Place label (optional)" />
          </div>
        </div>
      )}

      <p className={`text-xs ${validation?.ok ? "text-emerald-600" : "text-amber-600"}`}>
        {validation?.msg}
      </p>
    </div>
  );
}

