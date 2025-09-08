import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";

export default function About() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("about.title", "About")}</title>
        <meta name="description" content="Générez et gérez des QR codes simplement. Découvrez notre mission et notre approche centrée sur la qualité et la confidentialité." />
      </Head>
      <main className="mx-auto max-w-5xl px-6 md:px-10 py-10 space-y-12">
        {/* Hero */}
        <section className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t("about.title", "About")}</h1>
          <p className="text-black/70 dark:text-white/70 max-w-3xl">{t("about.heroLead")}</p>
        </section>

        {/* Mission */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-2">{t("about.missionTitle")}</h2>
            <p className="text-black/70 dark:text-white/70 leading-relaxed">{t("about.missionBody")}</p>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
            <h3 className="text-base font-medium mb-2">{t("about.summaryTitle")}</h3>
            <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
              <li>• {t("about.summary1")}</li>
              <li>• {t("about.summary2")}</li>
              <li>• {t("about.summary3")}</li>
              <li>• {t("about.summary4")}</li>
            </ul>
          </div>
        </section>

        {/* What we offer */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t("about.offeringsTitle")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.offerDesignerTitle")}</div>
              <div className="text-sm text-black/70 dark:text-white/70">{t("about.offerDesignerBody")}</div>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.offerDynamicTitle")}</div>
              <div className="text-sm text-black/70 dark:text-white/70">{t("about.offerDynamicBody")}</div>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.offerAnalyticsTitle")}</div>
              <div className="text-sm text-black/70 dark:text-white/70">{t("about.offerAnalyticsBody")}</div>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.offerIntegrationsTitle")}</div>
              <div className="text-sm text-black/70 dark:text-white/70">{t("about.offerIntegrationsBody")}</div>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.offerBestPracticesTitle")}</div>
              <div className="text-sm text-black/70 dark:text-white/70">{t("about.offerBestPracticesBody")}</div>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.offerSupportTitle")}</div>
              <div className="text-sm text-black/70 dark:text-white/70">{t("about.offerSupportBody")}</div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t("about.howTitle")}</h2>
          <ol className="grid md:grid-cols-3 gap-4 text-sm text-black/70 dark:text-white/70">
            <li className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.howStep1Title")}</div>
              <div>{t("about.howStep1Body")}</div>
            </li>
            <li className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.howStep2Title")}</div>
              <div>{t("about.howStep2Body")}</div>
            </li>
            <li className="rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
              <div className="font-medium mb-1">{t("about.howStep3Title")}</div>
              <div>{t("about.howStep3Body")}</div>
            </li>
          </ol>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">{t("about.ctaTitle")}</div>
            <div className="text-sm text-black/70 dark:text-white/70">{t("about.ctaDesc")}</div>
          </div>
          <div className="flex gap-3">
            <Link href="/designer" className="px-5 py-3 rounded-md border border-black/10 dark:border-white/10">{t("about.ctaOpenDesigner")}</Link>
            <Link href="/blog" className="px-5 py-3 rounded-md border border-black/10 dark:border-white/10">{t("about.ctaViewGuides")}</Link>
          </div>
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
