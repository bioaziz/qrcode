import { dbConnect } from "@/lib/mongoose";
import QrCode from "@/models/QrCode";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps(ctx) {
  const { slug } = ctx.params;
  await dbConnect();
  const code = await QrCode.findOne({ slug }).lean();
  if (!code) return { notFound: true };
  return {
    props: {
      slug,
      code: JSON.parse(JSON.stringify(code)),
      ...(await serverSideTranslations(ctx.locale, ['common'])),
    },
  };
}

export default function MicroApp({ slug, code }) {
  const name = code?.meta?.name || slug;
  const { t } = useTranslation('common');
  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_10%,rgba(99,102,241,0.18),transparent)]">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2 pt-8">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs opacity-80">
            <span>QR</span>
            <span className="opacity-60">{code.type}</span>
          </div>
          <h1 className="text-3xl font-semibold break-words">{name}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('micro.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Link href={`/r/${slug}`}><Button>{t('micro.openDestination')}</Button></Link>
                <Link href={`/studio/qrs`}><Button variant="outline">{t('micro.openStudio')}</Button></Link>
              </div>
              <form method="POST" action={`/api/pay-later/initiate?slug=${encodeURIComponent(slug)}`}>
                <Button type="submit" variant="outline">{t('micro.startPayLater')}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('micro.details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="opacity-70">{t('micro.slug')}: <span className="font-mono break-all">{slug}</span></div>
              <div className="opacity-70">{t('micro.type')}: {code.type}</div>
              {code.dynamicConfig?.primaryUrl && (
                <div className="opacity-70 break-all">{t('micro.primaryUrl')} <span className="underline">{code.dynamicConfig.primaryUrl}</span></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

