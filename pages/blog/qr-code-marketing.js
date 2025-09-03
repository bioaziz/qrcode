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

          {/* Intro */}
          <section className="space-y-4">
            <p className="text-gray-700">
              Les QR codes relient vos supports physiques à vos canaux digitaux en un
              seul scan.
            </p>
            <p className="text-gray-700">
              Au Bénin, ils sont particulièrement efficaces pour diriger les clients vers
              WhatsApp, des pages promos ou des avis en ligne.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            {[
              ["Vitrine & affiches", "Ajoutez un QR “Voir nos promos” avec redirection vers WhatsApp Business."],
              ["Flyers & cartes", "Code vers page de capture (lead magnet) ou coupon -10%."],
              ["Réseaux sociaux", "QR vers Instagram/TikTok avec UTM pour mesurer."],
              ["Événements", "Inscription, programme, plan d’accès scannables."],
              ["Packaging", "Tutoriels, garantie, avis clients via QR."],
              ["Partenariats", "QR co-brandé avec un partenaire local pour audience croisée."],
              ["Cartes de visite", "Redirige vers votre portfolio ou prise de rendez-vous."],
              ["TV & radio", "Affichez un QR pendant un spot pour prolonger l’expérience en ligne."],
            ].map(([title, desc]) => (
              <div key={title} className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-700">{desc}</p>
              </div>
            ))}
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Lancer une campagne QR en 4 étapes</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Définissez l’objectif : ventes, abonnés, trafic...</li>
              <li>Créez le contenu et générez votre QR avec un lien traçable.</li>
              <li>Diffusez le QR sur vos supports (flyers, réseaux, packaging).</li>
              <li>Analysez les scans et ajustez votre message.</li>
            </ol>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Erreurs à éviter</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>QR trop petit ou peu contrasté</li>
              <li>Page cible non optimisée pour mobile</li>
              <li>Absence d’appel clair à l’action</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Mesurer l’impact</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Utilisez des **liens courts** différents par canal (affiche, flyer, réseau social).</li>
              <li>Ajoutez des **UTM** (source, medium, campaign) pour Google Analytics.</li>
              <li>Comparez scans vs ventes pour calculer le ROI de chaque campagne.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Avec ces données, vous identifierez les supports les plus performants et
              optimiserez vos prochaines actions marketing.
            </p>
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
