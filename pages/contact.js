import Head from "next/head";
import { useTranslation } from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";

export default function Contact() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("contact.title", "Contact")}</title>
      </Head>
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">{t("contact.title", "Contact")}</h1>
        <p className="text-lg text-muted-foreground">{t("contact.description", "Feel free to reach out to us.")}</p>
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
