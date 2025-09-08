import Head from "next/head";
import Link from "next/link";
import {useTranslation} from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";
import {useMemo, useState} from "react";

export default function Contact() {
  const { t } = useTranslation("common");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const WHATSAPP_NUMBER = "2290143128970";

  const waNumber = useMemo(() => {
    return WHATSAPP_NUMBER.replace(/\D/g, "")

  }, [WHATSAPP_NUMBER]);

  const mailtoHref = useMemo(() => {
    const to = "hello@qr.genius.bj"; // change if needed
    const params = new URLSearchParams({
      subject: form.subject || "Contact",
      body: `${form.name}\n${form.email}\n\n${form.message}`,
    });
    return `mailto:${to}?${params.toString()}`;
  }, [form]);

  return (
    <>
      <Head>
        <title>{t("contact.title", "Contact")}</title>
        <meta name="description" content="Contactez-nous pour toute question sur la création de QR codes, l’intégration ou l’assistance." />
      </Head>
      <main className="mx-auto max-w-5xl px-6 md:px-10 py-10 space-y-12">
        {/* Hero */}
        <section className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("contact.title", "Contact")}</h1>
          <p className="text-black/70 dark:text-white/70 max-w-3xl">{t("contact.heroLead")}</p>
        </section>

        {/* Contact options */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
            <div className="text-sm font-medium mb-2">{t("contact.emailTitle")}</div>
            <div className="text-black/70 dark:text-white/70 text-sm">{t("contact.emailDesc")}</div>
            <Link href={`mailto:${t('contact.emailAddress')}`} className="mt-3 inline-block text-sm underline">{t("contact.emailAddress")}</Link>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
            <div className="text-sm font-medium mb-2">{t("contact.socialTitle")}</div>
            <div className="text-black/70 dark:text-white/70 text-sm">{t("contact.socialDesc")}</div>
            <div className="mt-3 space-x-4 text-sm">
              <Link href="/designer" className="underline">{t("contact.socialDesigner")}</Link>
              <Link href="/blog" className="underline">{t("contact.socialGuides")}</Link>
            </div>
            <div className="mt-3 text-sm">
              <Link href={`https://wa.me/${waNumber}`} className="underline" target="_blank" rel="noopener noreferrer">
                {t("contact.whatsappLabel")}: {WHATSAPP_NUMBER}
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
            <div className="text-sm font-medium mb-2">{t("contact.supportTitle")}</div>
            <div className="text-black/70 dark:text-white/70 text-sm">{t("contact.supportDesc")}</div>
            <div className="mt-3 text-sm text-black/70 dark:text-white/70">{t("contact.supportNote")}</div>
          </div>
        </section>

        {/* Form (mailto:) */}
        <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">{t("contact.formTitle")}</h2>
          <ContactForm t={t} mailtoHref={mailtoHref} form={form} setForm={setForm} />
        </section>

        {/* Help links */}
        <section className="grid md:grid-cols-3 gap-4">
          <Link href="/blog/qr-code-gratuit-benin" className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 block">
            <div className="font-medium mb-1">{t("contact.helpLink1Title")}</div>
            <div className="text-sm text-black/70 dark:text-white/70">{t("contact.helpLink1Desc")}</div>
          </Link>
          <Link href="/blog/qr-code-mobile-money" className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 block">
            <div className="font-medium mb-1">{t("contact.helpLink2Title")}</div>
            <div className="text-sm text-black/70 dark:text-white/70">{t("contact.helpLink2Desc")}</div>
          </Link>
          <Link href="/blog/qr-code-securite" className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 block">
            <div className="font-medium mb-1">{t("contact.helpLink3Title")}</div>
            <div className="text-sm text-black/70 dark:text-white/70">{t("contact.helpLink3Desc")}</div>
          </Link>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps({ locale }) {
  const { serverSideTranslations } = await import("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"], i18nConfig)),
    },
  };
}

function ContactForm({ t, mailtoHref, form, setForm }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t("contact.errors.nameRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("contact.errors.emailRequired");
    if (!form.message.trim()) e.message = t("contact.errors.messageRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    if (!validate()) {
      ev.preventDefault();
    }
  };

  const commonInput = "rounded-md border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm";
  const hint = (msg) => msg ? (<div className="text-xs text-black/70 mt-1">{msg}</div>) : null;

  return (
    <form action={mailtoHref} method="post" className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <label className="text-sm" htmlFor="name">{t("contact.formName")}</label>
        <input id="name" type="text" className={commonInput} value={form.name} aria-invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("contact.formNamePlaceholder")} />
        {hint(errors.name)}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm" htmlFor="email">{t("contact.formEmail")}</label>
        <input id="email" type="email" className={commonInput} value={form.email} aria-invalid={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("contact.formEmailPlaceholder")} />
        {hint(errors.email)}
      </div>
      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-sm" htmlFor="subject">{t("contact.formSubject")}</label>
        <input id="subject" type="text" className={commonInput} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t("contact.formSubjectPlaceholder")} />
      </div>
      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-sm" htmlFor="message">{t("contact.formMessage")}</label>
        <textarea id="message" rows={6} className={commonInput} value={form.message} aria-invalid={!!errors.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("contact.formMessagePlaceholder")} />
        {hint(errors.message)}
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="px-5 py-3 rounded-md border border-black/10 dark:border-white/10" aria-disabled={!!(errors.name || errors.email || errors.message)}>
          {t("contact.formSubmit")}
        </button>
      </div>
    </form>
  );
}
