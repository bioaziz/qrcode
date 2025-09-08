import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import i18nConfig from "../../next-i18next.config.mjs";

const posts = [
  {
    slug: "qr-code-histoire",
    title: "Histoire des QR Codes",
    description: "De 1994 à aujourd'hui",
    image: "/globe.svg",
  },
  {
    slug: "qr-code-gratuit-benin",
    title: "QR Code gratuit au Bénin",
    description: "Guide pour créer des QR codes gratuits",
    image: "/next.svg",
  },
  {
    slug: "qr-code-entreprises-benin",
    title: "QR Code pour entreprises au Bénin",
    description: "Utilisations professionnelles des QR codes",
    image: "/window.svg",
  },
  {
    slug: "qr-code-mobile-money",
    title: "QR Code et Mobile Money",
    description: "Les paiements mobiles avec QR",
    image: "/file.svg",
  },
  {
    slug: "qr-code-menu-restaurants",
    title: "QR Code pour menu de restaurant",
    description: "Créer des menus digitaux scannables",
    image: "/window.svg",
  },
  {
    slug: "qr-code-securite",
    title: "Sécurité des QR Codes",
    description: "Bonnes pratiques et lisibilité",
    image: "/file.svg",
  },
  {
    slug: "qr-code-marketing",
    title: "Marketing avec des QR Codes",
    description: "Lancer une campagne QR",
    image: "/globe.svg",
  },
];

export default function BlogIndex() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("blog.title", "Blog")}</title>
      </Head>
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("blog.title", "Blog")}</h1>
          <p className="text-muted-foreground">{t("blog.description", "Latest articles")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-black/20"
            >
              <img src={post.image} alt="" className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-muted-foreground">{post.description}</p>
                <span className="text-sm font-medium text-black/70 dark:text-white/70">
                  {t("blog.readMore", "Read more")}
                </span>
              </div>
            </Link>
          ))}
        </div>
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
