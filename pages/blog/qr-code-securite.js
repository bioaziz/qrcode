import Head from "next/head";
import Link from "next/link";

export default function QrCodeSecurite() {
  return (
    <>
      <Head>
        <title>Sécurité des QR Codes — Bonnes pratiques (Bénin)</title>
        <meta name="description" content="Éviter les arnaques, assurer la lisibilité et protéger vos clients : tout sur la sécurité des QR codes, du design aux tests." />
        <meta name="keywords" content="sécurité QR code, phishing QR, bonnes pratiques, Bénin" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Sécurité des QR Codes — Bonnes pratiques" />
        <meta property="og:image" content="https://qr.genius.bj/preview.png" />
        <meta property="og:url" content="https://qr.genius.bj/blog/qr-code-securite" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

        <main className="max-w-4xl mx-auto p-6 space-y-10 bg-white">
          <header className="text-center py-8 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Sécurité & Fiabilité des QR Codes</h1>
            <p className="text-lg text-gray-600">Protégez vos clients et votre marque avec des réglages simples.</p>
            <div className="mt-2 text-sm text-gray-500">⏱️ 7 min de lecture • 🔐 Conseils pratiques</div>
          </header>

          {/* Intro */}
          <section className="space-y-4">
            <p className="text-gray-700">
              Les QR codes sont pratiques mais peuvent devenir un vecteur d’attaque s’ils
              sont mal configurés.
            </p>
            <p className="text-gray-700">
              Que vous soyez une entreprise ou une association, quelques vérifications
              simples protègent vos utilisateurs.
            </p>
          </section>

        {/* Threats */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Menaces courantes</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>🎭 QR collé par-dessus (tampering) → vérifiez vos affiches régulièrement</li>
              <li>🧪 Phishing : URL trompeuse → utilisez des domaines vérifiés</li>
              <li>⚠️ QR illisible : faible contraste / pas de marge</li>
              <li>🔓 Partage d’informations sensibles en clair</li>
            </ul>
          </section>

          {/* Checklist */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Checklist avant publication</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Scannez le QR vous-même et vérifiez l’URL.</li>
              <li>Ajoutez un texte explicatif à proximité.</li>
              <li>Préférez des liens HTTPS et des domaines connus.</li>
            </ul>
          </section>

        {/* Best practices */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Bonnes pratiques à appliquer</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Utilisez un **contraste fort** (foncé sur clair) et une **marge** suffisante.</li>
              <li>Choisissez un **niveau d’erreur** élevé (Q/H) si vous ajoutez un **logo**.</li>
              <li>Testez votre QR sur plusieurs smartphones avant impression.</li>
              <li>Affichez l’URL lisible à côté du QR (transparence & confiance).</li>
              <li>Pour les paiements, privilégiez des **QR dynamiques** et traçables.</li>
            </ol>
          </section>

          {/* Dynamic vs static */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">QR statique vs dynamique</h2>
            <p className="text-gray-700">
              Un QR statique pointe vers une URL fixe, tandis qu’un QR dynamique redirige
              vers une page que vous pouvez mettre à jour sans changer le code.
            </p>
            <p className="text-gray-700">
              Les QR dynamiques offrent une meilleure traçabilité et la possibilité de
              désactiver un lien en cas de compromission.
            </p>
          </section>

          {/* Incident */}
          <section className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold mb-2">Que faire en cas de QR suspect ?</h2>
            <p className="text-gray-700">
              Si un client signale un QR malveillant, retirez immédiatement les supports
              concernés et communiquez un nouveau lien sûr. Changez les mots de passe
              associés si nécessaire.
            </p>
          </section>

        {/* CTA & links */}
        <section className="space-y-2">
          <Link href="/designer" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
            Générer un QR sécurisé →
          </Link>
          <div className="text-sm text-gray-600">
            Voir aussi :{" "}
            <Link href="/blog/qr-code-mobile-money" className="text-green-700 hover:underline">QR pour Mobile Money</Link>{" "}
            •{" "}
            <Link href="/blog/qr-code-gratuit-benin" className="text-green-700 hover:underline">Créer un QR gratuit</Link>
          </div>
        </section>
      </main>
    </>
  );
}
