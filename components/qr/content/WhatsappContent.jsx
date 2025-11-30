"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CountrySelector from "@/components/vendor/country-selector/CountrySelector";

export default function WhatsappContent({
  t,
  phone, setPhone,
  whatsCountry, setWhatsCountry,
  whatsDialCode, setWhatsDialCode,
  data, setData,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-3 items-end">
        <div>
          <Label className="mb-1 block">{t("designerEditor.whatsappPhone")}</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`+${whatsDialCode} 612345678`} />
        </div>
        <div>
          <CountrySelector country={whatsCountry} setCountry={setWhatsCountry} dialCode={whatsDialCode} setDialCode={setWhatsDialCode} />
        </div>
      </div>
      <div>
        <Label className="mb-1 block">{t("designerEditor.whatsappMessage")}</Label>
        <Textarea value={data} onChange={(e) => setData(e.target.value)} placeholder="Hello!" rows={3} />
      </div>
    </div>
  );
}

