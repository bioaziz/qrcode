import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import i18nConfig from "../next-i18next.config.mjs";
import QRDesigner from "@/components/QRDesigner";
import DesignerErrorBoundary from "@/components/DesignerErrorBoundary";

export default function DesignerPage() {
  const { status } = useSession();
  const { t } = useTranslation("common");
  return (
    <div className="font-sans min-h-screen">
      <main className="mx-auto max-w-6xl px-6 md:px-10 py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{t("designer.title")}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {t("designer.description")}
          </p>
        </div>
        <DesignerErrorBoundary>
          <QRDesigner />
        </DesignerErrorBoundary>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/pages/api/auth/[...nextauth]");
  const session = await getServerSession(context.req, context.res, authOptions);
  const { serverSideTranslations } = await import("next-i18next/serverSideTranslations");

  if (!session) {
    return {
      redirect: { destination: "/auth/signin", permanent: false },
    };
  }

  return {
    props: {
      session,
      ...(await serverSideTranslations(context.locale, ["common"], i18nConfig)),
    },
  };
}
