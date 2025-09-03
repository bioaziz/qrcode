import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  QrCode,
  Sparkles,

  
  LineChart,
  Layers,
  ShieldCheck,
  Settings2,
  Rocket,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";
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
    <>
      <Head>
        <title>QR Code Generator – Gratuit au Bénin</title>
        <meta
          name="description"
          content="Générez facilement vos QR codes personnalisés gratuitement au Bénin."
        />
        <meta
          name="keywords"
          content="QR code generator, QR code Benin, créer QR code, QR code gratuit"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="QR Code Generator – Gratuit au Bénin" />
        <meta
          property="og:description"
          content="Générateur de QR code rapide et gratuit pour les entreprises et particuliers au Bénin."
        />
        <meta property="og:image" content="https://qr.genius.bj/preview.png" />
        <meta property="og:url" content="https://qr.genius.bj" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QR Code Generator – Gratuit au Bénin" />
        <meta
          name="twitter:description"
          content="Générez vos QR codes gratuitement en ligne au Bénin."
        />
        <meta name="twitter:image" content="https://qr.genius.bj/preview.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Comment créer un QR Code gratuit au Bénin ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Allez sur qr.genius.bj, entrez vos informations et générez instantanément un QR Code.",
                  },
                },
              ],
            }),
          }}
        />

      </Head>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0b0d12] dark:to-[#0a0f1b]">
        <main className="mx-auto max-w-6xl px-6 md:px-10 py-10 space-y-16">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              QR Code Generator gratuit au Bénin
            </h1>
            <p className="mt-4 text-black/70 dark:text-white/70 text-base leading-relaxed">
              Créez des QR codes pour mobile money, entreprises, menus de restaurant et événements. Idéal pour les professionnels à Cotonou et dans toute l’Afrique de l’Ouest.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/designer">
                <Button size="lg">Générer un QR code maintenant</Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-black/70 dark:text-white/70">
              Ressources utiles :
              <Link href="/blog/qr-code-histoire" className="underline ml-1">
                Histoire des QR codes
              </Link>
              <Link href="/blog/qr-code-gratuit-benin" className="underline ml-1">
                Créer un QR Code gratuit
              </Link>
              ,
              <Link href="/blog/qr-code-mobile-money" className="underline ml-1">
                QR Code Mobile Money
              </Link>
              ,
              <Link href="/blog/qr-code-entreprises-benin" className="underline ml-1">
                QR Codes pour entreprises béninoises
              </Link>
              .
            </p>
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
    </>
  );
}

export async function getServerSideProps({ locale }) {
  const { serverSideTranslations } = await import("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"],  i18nConfig )),
    },
  };
}
