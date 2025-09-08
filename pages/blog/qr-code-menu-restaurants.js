import Head from "next/head";
import Link from "next/link";

export default function QrCodeRestaurantMenu() {
  return (
    <>
      <Head>
        <title>QR Code pour Menu de Restaurant — Créez des menus digitaux (Bénin)</title>
        <meta name="description" content="Guide pour créer un menu de restaurant avec QR code : PDF, page web, multilingue, conseils d'impression. Idéal pour Cotonou, Porto-Novo et tout le Bénin." />
        <meta name="keywords" content="QR code menu restaurant, QR code menu PDF, QR code Bénin, Cotonou, menu digital" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="QR Code pour Menu de Restaurant au Bénin" />
        <meta property="og:description" content="Transformez votre carte en menu digital scannable avec un QR code." />
        <meta property="og:image" content="https://qr.genius.bj/preview.png" />
        <meta property="og:url" content="https://qr.genius.bj/blog/qr-code-restaurant-menu" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="max-w-4xl mx-auto p-6 space-y-10 bg-white border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70">

        {/* Header */}
        <header className="text-center py-8 border-b border-gray-200">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 border border-gray-300">
            Restaurants • Bénin
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            QR Code pour Menu de Restaurant (PDF & Page Web)
          </h1>
          <div
            data-placeholder="header-image"
            className="rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 aspect-[16/9] flex items-center justify-center text-sm text-black/60 dark:text-white/60 my-6"
          >
            Image placeholder
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Offrez un menu digital scannable en un clic — multilingue, à jour et sans réimpression.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            6 min de lecture • Bonnes pratiques & modèles
          </div>
        </header>

        {/* Main CTA */}
        <section className="p-8 rounded-xl text-center border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Créez votre QR Menu maintenant</h2>
          <p className="text-gray-600 mb-6">
            Importez un PDF ou indiquez un lien de menu en ligne. Assistance personnalisée disponible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/designer"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Générateur gratuit →
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Contactez-nous pour aide
            </Link>
          </div>
        </section>

        {/* Why */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Pourquoi un menu avec QR code ?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Moins d'impression et mises à jour instantanées</li>
              <li>Multilingue (FR, EN, Fon, Yoruba)</li>
              <li>Photos & allergènes toujours à jour</li>
              <li>Campagnes saisonnières en un clic</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                <strong>Besoin d'aide pour démarrer ?</strong>
              </p>
              <p className="text-sm text-gray-600">
                Notre équipe vous accompagne dans la création de votre menu digital personnalisé.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Avantages pour votre établissement</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Un menu digital réduit les coûts d'impression, facilite les mises à jour et offre une expérience moderne à vos clients.
            </p>
            <p className="text-gray-700 mb-4">
              Vous pouvez également y intégrer des photos appétissantes, des informations sur les allergènes ou des suggestions de boissons pour augmenter le panier moyen.
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">💡 Conseil professionnel</p>
              <p className="text-sm text-gray-600">
                Nos clients voient en moyenne une augmentation de 15% des ventes grâce aux menus digitaux avec photos.
                <Link href="/contact" className="text-black hover:underline ml-1">
                  Discutons de votre projet →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* How-to */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Comment créer votre QR Menu (3 options)</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <strong>QR → PDF :</strong> uploadez un PDF (carte) et liez-le au QR.
            </li>
            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <strong>QR → Page web :</strong> hébergez le menu sur une URL (Google Drive / page site), liez l'URL.
            </li>
            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <strong>QR dynamique :</strong> utilisez un lien court (ex: <code className="bg-gray-100 px-2 py-1 rounded text-sm">https://qr.genius.bj/s/menu-2025</code>) modifiable sans réimprimer.
            </li>
          </ol>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-3">
              Chaque option peut être personnalisée avec votre logo et des couleurs cohérentes à votre identité visuelle.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Pas sûr de quelle option choisir ?</strong>
              <Link href="/contact" className="text-black hover:underline ml-1">
                Contactez-nous pour un conseil gratuit
              </Link>
            </p>
          </div>
        </section>

        {/* Multilingual */}
        <section className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
          <h2 className="text-2xl font-bold text-black dark:text-white">Menus multilingues & saisonniers</h2>
          <p className="text-gray-700">
            Proposez facilement plusieurs langues pour accueillir touristes et expatriés. Un QR dynamique permet de basculer entre français, anglais ou langues locales.
          </p>
          <p className="text-gray-700">
            Pour les menus de fêtes ou les plats du jour, changez simplement le contenu lié au QR sans réimprimer vos supports.
          </p>
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-800">🌍 Solution clé en main disponible</p>
            <p className="text-sm text-gray-600 mt-1">
              Nous créons votre menu multilingue complet avec traductions professionnelles.
              <Link href="/contact" className="text-black hover:underline ml-1">
                Demandez un devis →
              </Link>
            </p>
          </div>
        </section>

        {/* Feedback */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Collecter des avis & statistiques</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              En utilisant des liens traçables, vous saurez combien de clients consultent votre carte et pourrez leur proposer un formulaire d'avis après le repas.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">📊 Tableau de bord inclus</p>
              <p className="text-sm text-gray-600">
                Suivez vos statistiques en temps réel et optimisez votre menu selon les préférences clients.
                <Link href="/contact" className="text-black hover:underline ml-1">
                  En savoir plus →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Printing */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Impression & lisibilité</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Taille min. table : 2.5–3 cm ; affiche : 5–7 cm
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Contraste élevé (QR foncé sur fond clair)
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Marges (quiet zone) visibles
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ajoutez le texte "Scannez pour le menu"
              </li>
            </ul>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-800 mb-2">🖨️ Service d'impression</p>
              <p className="text-sm text-gray-600 mb-3">
                Nous imprimons vos QR codes sur supports de qualité (plastifiés, chevalet, stickers).
              </p>
              <Link
                href="/contact"
                className="inline-block text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Commander impression
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-black text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-3">Prêt à digitaliser votre menu ?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Notre équipe vous accompagne de A à Z : création du QR code, hébergement du menu, impression des supports et formation de votre équipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contactez-nous maintenant
            </Link>
            <Link
              href="tel:+22912345678"
              className="border border-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              📞 Appel gratuit
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Consultation gratuite • Devis sous 24h • Support en français
          </p>
        </section>

        {/* Links */}
        <section className="space-y-3 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-black dark:text-white">Ressources liées</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              <Link className="hover:underline" href="/blog/qr-code-gratuit-benin">
                Créer un QR Code gratuit (Bénin)
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/blog/qr-code-entreprises-benin">
                10 usages pour entreprises béninoises
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/blog/qr-code-securite">
                Sécurité & bonnes pratiques
              </Link>
            </li>
          </ul>
        </section>

      </main>
    </>
  );
}