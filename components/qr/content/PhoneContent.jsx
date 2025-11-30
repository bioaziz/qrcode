"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone as PhoneIcon } from "lucide-react";

export default function PhoneContent({ t, phone, setPhone }) {
  return (
    <div>
      <Label className="mb-1 flex items-center gap-2" htmlFor="phone"><PhoneIcon className="size-4"/> {t("designerEditor.contentTab.phoneLabel")}</Label>
      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("designerEditor.contentTab.phonePlaceholder")} />
    </div>
  );
}

