"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Mail, Phone as PhoneIcon, Link as LinkIcon, QrCode, Wifi as WifiIcon, Shield } from "lucide-react";

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="mb-1 flex items-center gap-2"><QrCode className="size-4"/> Preset</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select preset" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="freeform">Freeform</SelectItem>
              <SelectItem value="link">Link</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="wifi">Wi‑Fi</SelectItem>
              <SelectItem value="mecard">MeCard</SelectItem>
              <SelectItem value="vcard">vCard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <Button variant="outline" onClick={copyContent}>Copy Content</Button>
          <Button variant="outline" onClick={copyImage}>Copy Image</Button>
        </div>
      </div>

      {mode === "freeform" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="freeform-content"><QrCode className="size-4"/> Content</Label>
          <Input id="freeform-content" value={data} onChange={(e) => setData(e.target.value)} placeholder="Enter text, URL, phone, etc." />
        </div>
      )}
      {mode === "link" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="link-url"><LinkIcon className="size-4"/> URL</Label>
          <Input id="link-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
        </div>
      )}
      {mode === "phone" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="phone"><PhoneIcon className="size-4"/> Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+123456789" />
        </div>
      )}
      {mode === "email" && (
        <div>
          <Label className="mb-1 flex items-center gap-2" htmlFor="email"><Mail className="size-4"/> Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 flex items-center gap-2" htmlFor="email-subject"><Mail className="size-4"/> Subject</Label>
              <Input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Hello" />
            </div>
            <div>
              <Label className="mb-1 flex items-center gap-2" htmlFor="email-body"><Mail className="size-4"/> Body</Label>
              <Input id="email-body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Message..." />
            </div>
          </div>
        </div>
      )}
      {(mode === "mecard" || mode === "vcard") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block">First name</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Last name</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Phone</Label>
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Organization</Label>
            <Input value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">Street</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">State</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">ZIP</Label>
            <Input value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Country</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block">Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      )}
      {mode === "wifi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 flex items-center gap-2" htmlFor="ssid"><WifiIcon className="size-4"/> SSID</Label>
            <Input id="ssid" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="Network name" />
          </div>
          <div>
            <Label className="mb-1 flex items-center gap-2"><Shield className="size-4"/> Security</Label>
            <Select value={wifiType} onValueChange={setWifiType}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Security" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">No password</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {wifiType !== "nopass" && (
            <div>
              <Label className="mb-1 flex items-center gap-2" htmlFor="wifi-pass"><Shield className="size-4"/> Password</Label>
              <Input id="wifi-pass" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder="password" />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm mt-2">
            <Switch checked={wifiHidden} onCheckedChange={setWifiHidden} id="wifi-hidden" />
            <Label htmlFor="wifi-hidden">Hidden network</Label>
          </div>
        </div>
      )}

      <p className={`text-xs ${validation?.ok ? "text-emerald-600" : "text-amber-600"}`}>
        {validation?.msg}
      </p>
    </div>
  );
}

