import Head from "next/head";
import Link from "next/link";

export default function QrCodeMarketing() {
  return (
    <>
      <Head>
        <title>Marketing avec QR Codes — Idées & Exemples (Bénin)</title>
        <meta name="description" content="15 idées pour booster votre marketing avec des QR codes : flyers, vitrines, réseaux sociaux, coupons, affluence en magasin." />
        <meta name="keywords" content="marketing QR code, campagnes QR, coupons QR, Bénin, Cotonou" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Marketing avec QR Codes — Idées & Exemples" />
        <meta property="og:image" content="https://qr.genius.bj/preview.png" />
        <meta property="og:url" content="https://qr.genius.bj/blog/qr-code-marketing" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="max-w-4xl mx-auto p-6 space-y-10 bg-white">
        <header className="text-center py-8 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Marketing avec des QR Codes</h1>
          <p className="text-lg text-gray-600">15 idées testées pour attirer plus de clients au Bénin.</p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          {[
            ["Vitrine & affiches", "Ajoutez un QR “Voir nos promos” avec redirection vers WhatsApp Business."],
            ["Flyers & cartes", "Code vers page de capture (lead magnet) ou coupon -10%."],
            ["Réseaux sociaux", "QR vers Instagram/TikTok avec UTM pour mesurer."],
            ["Événements", "Inscription, programme, plan d’accès scannables."],
            ["Packaging", "Tutoriels, garantie, avis clients via QR."],
            ["Partenariats", "QR co-brandé avec un partenaire local pour audience croisée."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-700">{desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Mesurer l’impact</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Utilisez des **liens courts** différents par canal (affiche, flyer, réseau social).</li>
            <li>Ajoutez des **UTM** (source, medium, campaign) pour Google Analytics.</li>
            <li>Comparez scans vs ventes pour calculer le ROI de chaque campagne.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <Link href="/designer" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
            Créer un QR pour ma campagne →
          </Link>
          <p className="text-sm text-gray-600">
            Voir aussi : <Link href="/blog/qr-code-entreprises-benin" className="text-green-700 hover:underline">Usages en entreprise</Link> •{" "}
            <Link href="/blog/qr-code-gratuit-benin" className="text-green-700 hover:underline">Créer un QR gratuit</Link>
          </p>
        </section>
      </main>
    </>
  );
}
