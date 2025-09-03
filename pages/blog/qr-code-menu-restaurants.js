import Head from "next/head";
import Link from "next/link";

export default function QrCodeRestaurantMenu() {
  return (
    <>
      <Head>
        <title>QR Code pour Menu de Restaurant — Créez des menus digitaux (Bénin)</title>
          <meta name="description" content="Guide pour créer un menu de restaurant avec QR code : PDF, page web, multilingue, conseils d&apos;impression. Idéal pour Cotonou, Porto-Novo et tout le Bénin." />
        <meta name="keywords" content="QR code menu restaurant, QR code menu PDF, QR code Bénin, Cotonou, menu digital" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="QR Code pour Menu de Restaurant au Bénin" />
        <meta property="og:description" content="Transformez votre carte en menu digital scannable avec un QR code." />
        <meta property="og:image" content="https://qr.genius.bj/preview.png" />
        <meta property="og:url" content="https://qr.genius.bj/blog/qr-code-restaurant-menu" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="max-w-4xl mx-auto p-6 space-y-10 bg-white">
        {/* Header */}
        <header className="text-center py-8 border-b border-gray-200">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
            🍽️ Restaurants • 🇧🇯 Bénin
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            QR Code pour Menu de Restaurant (PDF & Page Web)
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Offrez un menu digital scannable en un clic — multilingue, à jour et sans reimpression.
          </p>
          <div className="mt-4 text-sm text-gray-500">⏱️ 6 min de lecture • ✅ Bonnes pratiques & modèles</div>
        </header>

        {/* CTA */}
        <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-2">Créez votre QR Menu maintenant</h2>
          <p className="opacity-90 mb-6">Importez un PDF ou indiquez un lien de menu en ligne.</p>
          <Link href="/designer" className="inline-block bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            🎨 Générateur gratuit →
          </Link>
        </section>

        {/* Why */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Pourquoi un menu avec QR code ?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>💸 Moins d’impression et mises à jour instantanées</li>
            <li>🌍 Multilingue (FR, EN, Fon, Yoruba)</li>
            <li>📱 Photos & allergènes toujours à jour</li>
            <li>🔁 Campagnes saisonnières en un clic</li>
          </ul>
        </section>

        {/* Benefits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Avantages pour votre établissement</h2>
            <p className="text-gray-700">
              Un menu digital réduit les coûts d’impression, facilite les mises à jour et
              offre une expérience moderne à vos clients.
            </p>
          <p className="text-gray-700">
            Vous pouvez également y intégrer des photos appétissantes, des informations
            sur les allergènes ou des suggestions de boissons pour augmenter le panier
            moyen.
          </p>
        </section>

        {/* How-to */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Comment créer votre QR Menu (3 options)</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>QR → PDF :</strong> uploadez un PDF (carte) et liez-le au QR.</li>
            <li><strong>QR → Page web :</strong> hébergez le menu sur une URL (Google Drive / page site), liez l’URL.</li>
            <li><strong>QR dynamique :</strong> utilisez un lien court (ex: <code>https://qr.genius.bj/s/menu-2025</code>) modifiable sans réimprimer.</li>
          </ol>
          <p className="text-gray-700">
            Chaque option peut être personnalisée avec votre logo et des couleurs
            cohérentes à votre identité visuelle.
          </p>
        </section>

        {/* Multilingual */}
        <section className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-bold">Menus multilingues & saisonniers</h2>
          <p className="text-gray-700">
            Proposez facilement plusieurs langues pour accueillir touristes et
            expatriés. Un QR dynamique permet de basculer entre français, anglais ou
            langues locales.
          </p>
          <p className="text-gray-700">
            Pour les menus de fêtes ou les plats du jour, changez simplement le
            contenu lié au QR sans réimprimer vos supports.
          </p>
        </section>

        {/* Feedback */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Collecter des avis & statistiques</h2>
            <p className="text-gray-700">
              En utilisant des liens traçables, vous saurez combien de clients consultent
              votre carte et pourrez leur proposer un formulaire d’avis après le repas.
            </p>
        </section>

        {/* Printing */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Impression & lisibilité</h2>
          <ul className="text-gray-700 space-y-2">
            <li>📐 Taille min. table : 2.5–3 cm ; affiche : 5–7 cm</li>
            <li>🎯 Contraste élevé (QR foncé sur fond clair)</li>
            <li>⬜ Marges (quiet zone) visibles</li>
            <li>🖼️ Ajoutez le texte “Scannez pour le menu”</li>
          </ul>
        </section>

        {/* Links */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Ressources liées</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><Link className="text-green-700 hover:underline" href="/blog/qr-code-gratuit-benin">Créer un QR Code gratuit (Bénin)</Link></li>
            <li><Link className="text-green-700 hover:underline" href="/blog/qr-code-entreprises-benin">10 usages pour entreprises béninoises</Link></li>
            <li><Link className="text-green-700 hover:underline" href="/blog/qr-code-securite">Sécurité & bonnes pratiques</Link></li>
          </ul>
        </section>
      </main>
    </>
  );
}
