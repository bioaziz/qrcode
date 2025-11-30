"use client";

import {useEffect, useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import PdfContent from "@/components/qr/content/PdfContent";
import ImageContent from "@/components/qr/content/ImageContent";
import Mp3Content from "@/components/qr/content/Mp3Content";
import VideoContent from "@/components/qr/content/VideoContent";
import ApplinkContent from "@/components/qr/content/ApplinkContent";
import FreeformContent from "@/components/qr/content/FreeformContent";
import LinkContent from "@/components/qr/content/LinkContent";
import PhoneContent from "@/components/qr/content/PhoneContent";
import EmailContent from "@/components/qr/content/EmailContent";
import WifiContent from "@/components/qr/content/WifiContent";
import WhatsappContent from "@/components/qr/content/WhatsappContent";
import SmsContent from "@/components/qr/content/SmsContent";
import GeoContent from "@/components/qr/content/GeoContent";
import MapsContent from "@/components/qr/content/MapsContent";
import MeCardContent from "@/components/qr/content/MeCardContent";
import VcardContent from "@/components/qr/content/VcardContent";
import SocialLinksContent from "@/components/qr/content/SocialLinksContent";
import InstagramContent from "@/components/qr/content/InstagramContent";
import FacebookContent from "@/components/qr/content/FacebookContent";
import MenuContent from "@/components/qr/content/MenuContent";
import CouponContent from "@/components/qr/content/CouponContent";
import {
  File as FileIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  Mail,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  MessageSquare,
  Music,
  Phone as PhoneIcon,
  QrCode,
  Shield,
  Smartphone,
  User,
  Video,
  Wifi as WifiIcon,
} from "lucide-react";
import {useTranslation} from "next-i18next";
import {phoneCountries} from "@/lib/phone-countries";
import CountrySelector from "@/components/vendor/country-selector/CountrySelector";
// import { useState } from "react";

export default function ContentTab(props) {
  const {
    mode, setMode,
    data, setData,
    linkUrl, setLinkUrl,
    phone, setPhone,
    whatsCountry, setWhatsCountry,
    whatsDialCode, setWhatsDialCode,
    pdfTitle, setPdfTitle,
    pdfDescription, setPdfDescription,
    pdfCtaText, setPdfCtaText,
    pdfOpenTarget, setPdfOpenTarget,
    pdfCompany, setPdfCompany,
    pdfWebsite, setPdfWebsite,
    pdfTitleFont, setPdfTitleFont,
    pdfTextFont, setPdfTextFont,
    pdfDirect, setPdfDirect,
    pdfRequirePassword, setPdfRequirePassword,
    pdfPassword, setPdfPassword,
    pdfStyle, setPdfStyle,
    pdfAccent, setPdfAccent,
    pdfAccent2, setPdfAccent2,
    mediaCover, setMediaCover,
    email, setEmail, emailSubject, setEmailSubject, emailBody, setEmailBody,
    firstName, setFirstName, lastName, setLastName, contactPhone, setContactPhone,
    contactEmail, setContactEmail, org, setOrg, url, setUrl, note, setNote,
    street, setStreet, city, setCity, state, setState, zip, setZip, country, setCountry,
    wifiSsid, setWifiSsid, wifiType, setWifiType, wifiPass, setWifiPass, wifiHidden, setWifiHidden,
    validation,
    copyContent, copyImage,
  } = props;

  const { t } = useTranslation("common");

  // Localized country names via Intl.DisplayNames
  const locale = typeof navigator !== 'undefined' ? (navigator.language || 'en-US') : 'en-US';
  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], {type: 'region'});
    } catch {
      return null;
    }
  }, [locale]);
  const countryName = (iso2) => {
    try {
      return regionNames?.of(iso2) || iso2;
    } catch {
      return iso2;
    }
  };

  // Detect user country from browser locale
  const detectUserIso = () => {
    try {
      const lang = (typeof navigator !== 'undefined' && (navigator.language || navigator.languages?.[0])) || 'en-US';
      const m = /[-_](\w\w)/.exec(lang);
      const iso = (m?.[1] || '').toUpperCase();
      if (iso && phoneCountries.some(c => c.iso2 === iso)) return iso;
    } catch {
    }
    return 'US';
  };
  const [userCountryIso, setUserCountryIso] = useState('US');
  const [countrySearch, setCountrySearch] = useState('');

  useEffect(() => {
    const iso = detectUserIso();
    setUserCountryIso(iso);
    if (whatsCountry === 'US' && iso !== 'US') {
      setWhatsCountry(iso);
      const c = phoneCountries.find(x => x.iso2 === iso);
      if (c) setWhatsDialCode(c.dial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    let list = phoneCountries;
    if (q) {
      list = phoneCountries.filter(c => {
        const name = (countryName(c.iso2) || '').toLowerCase();
        return name.includes(q) || c.iso2.toLowerCase().includes(q) || c.dial.includes(q);
      });
    }
    const i = list.findIndex(c => c.iso2 === userCountryIso);
    if (i > 0) {
      const copy = list.slice();
      const [u] = copy.splice(i, 1);
      copy.unshift(u);
      return copy;
    }
    return list;
  }, [countrySearch, userCountryIso, regionNames]);

  // When switching to WhatsApp preset, auto-prefill the phone field with +dial code if empty
  useEffect(() => {
    if (mode === 'whatsapp') {
      const v = (phone || '').trim();
      if (!v) setPhone(`+${whatsDialCode} `);
    }
    if (mode === 'sms') {
      const v = (phone || '').trim();
      if (!v) setPhone(`+${props.smsDialCode} `);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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
              // New presets inspired by home.html (inputs to be added later)
              {key: "instagram", label: "Instagram", icon: ImageIcon},
              {key: "facebook", label: "Facebook", icon: User},
              {key: "menu", label: "Menu", icon: List},
              {key: "coupon", label: "Coupon", icon: FileIcon},
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
        <FreeformContent t={t} data={data} setData={setData} />
      )}
      {mode === "link" && (
        <LinkContent
          t={t}
          linkUrl={linkUrl} setLinkUrl={setLinkUrl}
          pdfTitle={pdfTitle} setPdfTitle={setPdfTitle}
          pdfDescription={pdfDescription} setPdfDescription={setPdfDescription}
          pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText}
          pdfTitleFont={pdfTitleFont} setPdfTitleFont={setPdfTitleFont}
          pdfTextFont={pdfTextFont} setPdfTextFont={setPdfTextFont}
          pdfStyle={pdfStyle} setPdfStyle={setPdfStyle}
          pdfAccent={pdfAccent} setPdfAccent={setPdfAccent}
          pdfAccent2={pdfAccent2} setPdfAccent2={setPdfAccent2}
        />
      )}
      {mode === "pdf" && (
        <PdfContent
          t={t}
          linkUrl={linkUrl} setLinkUrl={setLinkUrl}
          pdfDirect={pdfDirect} setPdfDirect={setPdfDirect}
          pdfCompany={pdfCompany} setPdfCompany={setPdfCompany}
          pdfTitle={pdfTitle} setPdfTitle={setPdfTitle}
          pdfDescription={pdfDescription} setPdfDescription={setPdfDescription}
          pdfWebsite={pdfWebsite} setPdfWebsite={setPdfWebsite}
          pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText}
          pdfOpenTarget={pdfOpenTarget} setPdfOpenTarget={setPdfOpenTarget}
          pdfTitleFont={pdfTitleFont} setPdfTitleFont={setPdfTitleFont}
          pdfTextFont={pdfTextFont} setPdfTextFont={setPdfTextFont}
          pdfStyle={pdfStyle} setPdfStyle={setPdfStyle}
          pdfAccent={pdfAccent} setPdfAccent={setPdfAccent}
          pdfAccent2={pdfAccent2} setPdfAccent2={setPdfAccent2}
          pdfRequirePassword={pdfRequirePassword} setPdfRequirePassword={setPdfRequirePassword}
          pdfPassword={pdfPassword} setPdfPassword={setPdfPassword}
        />
      )
      }
      { mode === "image" && (
        <ImageContent
          t={t}
          linkUrl={linkUrl} setLinkUrl={setLinkUrl}
          pdfTitle={pdfTitle} setPdfTitle={setPdfTitle}
          pdfDescription={pdfDescription} setPdfDescription={setPdfDescription}
          pdfWebsite={pdfWebsite} setPdfWebsite={setPdfWebsite}
          pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText}
          pdfOpenTarget={pdfOpenTarget} setPdfOpenTarget={setPdfOpenTarget}
          pdfTitleFont={pdfTitleFont} setPdfTitleFont={setPdfTitleFont}
          pdfTextFont={pdfTextFont} setPdfTextFont={setPdfTextFont}
          pdfStyle={pdfStyle} setPdfStyle={setPdfStyle}
          pdfAccent={pdfAccent} setPdfAccent={setPdfAccent}
          pdfAccent2={pdfAccent2} setPdfAccent2={setPdfAccent2}
        />
      )}

      { mode === "mp3" && (
        <Mp3Content
          t={t}
          linkUrl={linkUrl} setLinkUrl={setLinkUrl}
          pdfTitle={pdfTitle} setPdfTitle={setPdfTitle}
          pdfDescription={pdfDescription} setPdfDescription={setPdfDescription}
          pdfWebsite={pdfWebsite} setPdfWebsite={setPdfWebsite}
          pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText}
          pdfOpenTarget={pdfOpenTarget} setPdfOpenTarget={setPdfOpenTarget}
          pdfTitleFont={pdfTitleFont} setPdfTitleFont={setPdfTitleFont}
          pdfTextFont={pdfTextFont} setPdfTextFont={setPdfTextFont}
          pdfStyle={pdfStyle} setPdfStyle={setPdfStyle}
          pdfAccent={pdfAccent} setPdfAccent={setPdfAccent}
          pdfAccent2={pdfAccent2} setPdfAccent2={setPdfAccent2}
          mediaCover={mediaCover} setMediaCover={setMediaCover}
          pdfRequirePassword={pdfRequirePassword} setPdfRequirePassword={setPdfRequirePassword}
          pdfPassword={pdfPassword} setPdfPassword={setPdfPassword}
          mp3SocialLinks={props.mp3SocialLinks} setMp3SocialLinks={props.setMp3SocialLinks}
        />
      )}

      { mode === "video" && (
        <VideoContent
          t={t}
          linkUrl={linkUrl} setLinkUrl={setLinkUrl}
          pdfTitle={pdfTitle} setPdfTitle={setPdfTitle}
          pdfDescription={pdfDescription} setPdfDescription={setPdfDescription}
          pdfWebsite={pdfWebsite} setPdfWebsite={setPdfWebsite}
          pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText}
          pdfOpenTarget={pdfOpenTarget} setPdfOpenTarget={setPdfOpenTarget}
          pdfTitleFont={pdfTitleFont} setPdfTitleFont={setPdfTitleFont}
          pdfTextFont={pdfTextFont} setPdfTextFont={setPdfTextFont}
          pdfStyle={pdfStyle} setPdfStyle={setPdfStyle}
          pdfAccent={pdfAccent} setPdfAccent={setPdfAccent}
          pdfAccent2={pdfAccent2} setPdfAccent2={setPdfAccent2}
          mediaCover={mediaCover} setMediaCover={setMediaCover}
          pdfRequirePassword={pdfRequirePassword} setPdfRequirePassword={setPdfRequirePassword}
          pdfPassword={pdfPassword} setPdfPassword={setPdfPassword}
          videoSocialLinks={props.videoSocialLinks} setVideoSocialLinks={props.setVideoSocialLinks}
        />
      )}

      
      {mode === "whatsapp" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="mb-1 block">Country</Label>
                <CountrySelector
                    id="whatsapp-country"
                    value={whatsCountry}
                    priorityIso={userCountryIso}
                    onChange={(iso) => {
                      const prevDial = whatsDialCode;
                      setWhatsCountry(iso);
                      const c = phoneCountries.find((x) => x.iso2 === iso);
                      if (c) {
                        setWhatsDialCode(c.dial);
                        const current = (phone || "").trim();
                        const noSpaces = current.replace(/\s+/g, "");
                        if (!current || noSpaces.startsWith(`+${prevDial}`) || noSpaces === `+${prevDial}`) {
                          const rest = current.replace(new RegExp('^\\+?' + prevDial + '\\s*'), "");
                          const updated = `+${c.dial} ${rest}`.trim();
                          setPhone(updated);
                        }
                      }
                    }}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="mb-1 block">{t("designerEditor.contentTab.whatsappPhone")}</Label>
                <Input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => {
                      const v = (phone || "").trim();
                      if (!v) setPhone(`+${whatsDialCode} `);
                    }}
                    placeholder={`+${whatsDialCode} ${t("designerEditor.contentTab.phonePlaceholder") || "5551234567"}`}
                />
              </div>
          </div>
          <div>
            <Label className="mb-1 block">{t("designerEditor.contentTab.whatsappMessage")}</Label>
            <Textarea value={data} onChange={(e) => setData(e.target.value)}
                      placeholder={t("designerEditor.contentTab.bodyPlaceholder") || "Write your message"}
                      maxLength={1000} rows={5}/>
          </div>
          </div>
      )}
      
      
      
      {mode === "wifi" && (
        <WifiContent t={t} wifiSsid={wifiSsid} setWifiSsid={setWifiSsid} wifiType={wifiType} setWifiType={setWifiType} wifiPass={wifiPass} setWifiPass={setWifiPass} wifiHidden={wifiHidden} setWifiHidden={setWifiHidden} />
      )}

      {mode === "app" && (
        <ApplinkContent
          t={t}
          url={url} setUrl={setUrl}
          street={street} setStreet={setStreet}
          city={city} setCity={setCity}
          pdfTitle={pdfTitle} setPdfTitle={setPdfTitle}
          pdfDescription={pdfDescription} setPdfDescription={setPdfDescription}
          pdfTitleFont={pdfTitleFont} setPdfTitleFont={setPdfTitleFont}
          pdfTextFont={pdfTextFont} setPdfTextFont={setPdfTextFont}
          pdfStyle={pdfStyle} setPdfStyle={setPdfStyle}
          pdfAccent={pdfAccent} setPdfAccent={setPdfAccent}
          pdfAccent2={pdfAccent2} setPdfAccent2={setPdfAccent2}
          appCtaIos={props.appCtaIos} setAppCtaIos={props.setAppCtaIos}
          appCtaAndroid={props.appCtaAndroid} setAppCtaAndroid={props.setAppCtaAndroid}
          appCtaWeb={props.appCtaWeb} setAppCtaWeb={props.setAppCtaWeb}
          appAutoRedirect={props.appAutoRedirect} setAppAutoRedirect={props.setAppAutoRedirect}
        />
      )}

      {mode === "geo" && (
        <GeoContent t={t} state={state} setState={setState} zip={zip} setZip={setZip} country={country} setCountry={setCountry} />
      )}

      {mode === "maps" && (
        <MapsContent t={t} linkUrl={linkUrl} setLinkUrl={setLinkUrl} />
      )}

      {mode === "phone" && (
        <PhoneContent t={t} phone={phone} setPhone={setPhone} />
      )}

      {mode === "email" && (
        <EmailContent t={t} email={email} setEmail={setEmail} emailSubject={emailSubject} setEmailSubject={setEmailSubject} emailBody={emailBody} setEmailBody={setEmailBody} />
      )}

      {mode === "whatsapp" && (
        <WhatsappContent t={t} phone={phone} setPhone={setPhone} whatsCountry={whatsCountry} setWhatsCountry={setWhatsCountry} whatsDialCode={whatsDialCode} setWhatsDialCode={setWhatsDialCode} data={data} setData={setData} />
      )}

      {mode === "sms" && (
        <SmsContent t={t} phone={phone} setPhone={setPhone} smsCountry={props.smsCountry} setSmsCountry={props.setSmsCountry} smsDialCode={props.smsDialCode} setSmsDialCode={props.setSmsDialCode} data={data} setData={setData} />
      )}

      {mode === "mecard" && (
        <MeCardContent t={t} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} contactPhone={contactPhone} setContactPhone={setContactPhone} contactEmail={contactEmail} setContactEmail={setContactEmail} org={org} setOrg={setOrg} url={url} setUrl={setUrl} note={note} setNote={setNote} street={street} setStreet={setStreet} city={city} setCity={setCity} state={state} setState={setState} zip={zip} setZip={setZip} country={country} setCountry={setCountry} />
      )}

      {mode === "vcard" && (
        <VcardContent t={t} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} contactPhone={contactPhone} setContactPhone={setContactPhone} contactEmail={contactEmail} setContactEmail={setContactEmail} org={org} setOrg={setOrg} url={url} setUrl={setUrl} note={note} setNote={setNote} street={street} setStreet={setStreet} city={city} setCity={setCity} state={state} setState={setState} zip={zip} setZip={setZip} country={country} setCountry={setCountry} />
      )}

      {mode === "social" && (
        <SocialLinksContent t={t} socialLinks={props.socialLinks} setSocialLinks={props.setSocialLinks} />
      )}

      {mode === "instagram" && (
        <InstagramContent t={t} linkUrl={linkUrl} setLinkUrl={setLinkUrl} pdfTitle={pdfTitle} setPdfTitle={setPdfTitle} pdfDescription={pdfDescription} setPdfDescription={setPdfDescription} />
      )}

      {mode === "facebook" && (
        <FacebookContent t={t} linkUrl={linkUrl} setLinkUrl={setLinkUrl} pdfTitle={pdfTitle} setPdfTitle={setPdfTitle} pdfDescription={pdfDescription} setPdfDescription={setPdfDescription} />
      )}

      {mode === "menu" && (
        <MenuContent t={t} pdfTitle={pdfTitle} setPdfTitle={setPdfTitle} pdfDescription={pdfDescription} setPdfDescription={setPdfDescription} linkUrl={linkUrl} setLinkUrl={setLinkUrl} pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText} />
      )}

      {mode === "coupon" && (
        <CouponContent t={t} pdfTitle={pdfTitle} setPdfTitle={setPdfTitle} pdfDescription={pdfDescription} setPdfDescription={setPdfDescription} linkUrl={linkUrl} setLinkUrl={setLinkUrl} pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText} />
      )}

      <p className={`text-xs ${validation?.ok ? "text-emerald-600" : "text-amber-600"}`}>
        {validation?.msg}
      </p>
    </div>
  );
}
