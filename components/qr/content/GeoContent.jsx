"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function GeoContent({ t, state, setState, zip, setZip, country, setCountry }) {
  return (
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
  );
}

