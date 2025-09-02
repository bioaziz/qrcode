import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Sparkles, LineChart, Layers, ShieldCheck, Settings2, Rocket } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function Landing() {
  const { data: session } = useSession();
  const { t } = useTranslation("common");
  const ctaHref = session ? "/qrs" : "/auth/signin";

  const Feature = ({ icon: Icon, title, desc }) => (
    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur border-black/10 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-black/5 dark:bg-white/10 p-2">
            <Icon className="size-5" />
          </div>
          <div>
            <div className="font-semibold mb-1">{title}</div>
            <div className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{desc}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const features = [
    { icon: Settings2, title: t("landing.features.dynamicRouting.title"), desc: t("landing.features.dynamicRouting.desc") },
    { icon: LineChart, title: t("landing.features.analytics.title"), desc: t("landing.features.analytics.desc") },
    { icon: Layers, title: t("landing.features.presets.title"), desc: t("landing.features.presets.desc") },
    { icon: QrCode, title: t("landing.features.beautiful.title"), desc: t("landing.features.beautiful.desc") },
    { icon: ShieldCheck, title: t("landing.features.reliable.title"), desc: t("landing.features.reliable.desc") },
    { icon: Rocket, title: t("landing.features.fastSetup.title"), desc: t("landing.features.fastSetup.desc") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0b0d12] dark:to-[#0a0f1b]">
      <main className="mx-auto max-w-6xl px-6 md:px-10 py-10 space-y-16">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-3 py-1 text-xs text-black/70 dark:text-white/70 mb-4">
              <Sparkles className="size-3.5" />
              {t("landing.badge")}
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              {t("landing.title")}
            </h1>
            <p className="mt-4 text-black/70 dark:text-white/70 text-base leading-relaxed">
              {t("landing.description")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={ctaHref}><Button size="lg">{session ? t("landing.ctaMyQrs") : t("landing.ctaGetStarted")}</Button></Link>
              <Link href="/designer"><Button size="lg" variant="outline">{t("landing.ctaOpenDesigner")}</Button></Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-md bg-black/5 dark:bg-white/10 p-2"><QrCode className="size-5" /></div>
                <div className="font-medium">{t("landing.designerPreview.title")}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">{t("landing.designerPreview.customStylesTitle")}</div>
                  <div className="text-black/70 dark:text-white/70">{t("landing.designerPreview.customStylesDesc")}</div>
                </div>
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">{t("landing.designerPreview.dynamicDestinationsTitle")}</div>
                  <div className="text-black/70 dark:text-white/70">{t("landing.designerPreview.dynamicDestinationsDesc")}</div>
                </div>
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">{t("landing.designerPreview.instantAnalyticsTitle")}</div>
                  <div className="text-black/70 dark:text-white/70">{t("landing.designerPreview.instantAnalyticsDesc")}</div>
                </div>
                <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                  <div className="font-medium mb-1">{t("landing.designerPreview.shareExportTitle")}</div>
                  <div className="text-black/70 dark:text-white/70">{t("landing.designerPreview.shareExportDesc")}</div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-x-8 -bottom-8 blur-3xl opacity-40 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-sky-500/20 rounded-3xl h-32" />
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold">{t("landing.featureHeading")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Feature key={i} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <div className="text-lg font-semibold">{t("landing.ctaSection.title")}</div>
            <div className="text-sm text-black/70 dark:text-white/70">{t("landing.ctaSection.desc")}</div>
          </div>
          <div className="flex gap-3">
            <Link href={ctaHref}><Button size="lg">{session ? t("landing.ctaSection.ctaOpenDashboard") : t("landing.ctaSection.ctaGetStarted")}</Button></Link>
            <Link href="/designer"><Button size="lg" variant="outline">{t("landing.ctaSection.ctaOpenDesigner")}</Button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  const { serverSideTranslations } = await import("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
