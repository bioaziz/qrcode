"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";

export default function EmailContent({
  t,
  email, setEmail,
  emailSubject, setEmailSubject,
  emailBody, setEmailBody,
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1 flex items-center gap-2" htmlFor="email"><Mail className="size-4"/> {t("designerEditor.contentTab.emailLabel")}</Label>
        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("designerEditor.contentTab.emailPlaceholder")} />
      </div>
      <div>
        <Label className="mb-1 block" htmlFor="subject">{t("designerEditor.contentTab.subject")}</Label>
        <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder={t("designerEditor.contentTab.subjectPlaceholder")} />
      </div>
      <div>
        <Label className="mb-1 block" htmlFor="body">{t("designerEditor.contentTab.body")}</Label>
        <Textarea id="body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder={t("designerEditor.contentTab.bodyPlaceholder")} rows={3} />
      </div>
    </div>
  );
}

