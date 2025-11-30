"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CountrySelector from "@/components/vendor/country-selector/CountrySelector";
import { Textarea } from "@/components/ui/textarea";

export default function SmsContent({
  t,
  phone, setPhone,
  smsCountry, setSmsCountry,
  smsDialCode, setSmsDialCode,
  data, setData,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-3 items-end">
        <div>
          <Label className="mb-1 block">{t("designerEditor.smsPhone")}</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`+${smsDialCode} 612345678`} />
        </div>
        <div>
          <CountrySelector country={smsCountry} setCountry={setSmsCountry} dialCode={smsDialCode} setDialCode={setSmsDialCode} />
        </div>
      </div>
      <div>
        <Label className="mb-1 block">{t("designerEditor.smsBody")}</Label>
        <Textarea value={data} onChange={(e) => setData(e.target.value)} placeholder="Hello!" rows={3} />
      </div>
    </div>
  );
}

