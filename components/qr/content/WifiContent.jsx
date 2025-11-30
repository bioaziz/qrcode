"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, Wifi as WifiIcon } from "lucide-react";

export default function WifiContent({ t, wifiSsid, setWifiSsid, wifiType, setWifiType, wifiPass, setWifiPass, wifiHidden, setWifiHidden }) {
  return (
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
  );
}

