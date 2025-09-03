import Head from "next/head";
import { useTranslation } from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";

export default function About() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("about.title", "About")}</title>
      </Head>
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">{t("about.title", "About")}</h1>
        <p className="text-lg text-muted-foreground">{t("about.description", "Learn more about us.")}</p>
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
