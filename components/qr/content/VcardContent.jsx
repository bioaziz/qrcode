"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function VcardContent({
  t,
  firstName, setFirstName,
  lastName, setLastName,
  contactPhone, setContactPhone,
  contactEmail, setContactEmail,
  org, setOrg,
  url, setUrl,
  note, setNote,
  street, setStreet,
  city, setCity,
  state, setState,
  zip, setZip,
  country, setCountry,
}) {
  return (
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
  );
}

