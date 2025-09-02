import Head from "next/head";
import Link from "next/link";

export default function QrCodeMobileMoney() {
  return (
    <>
      <Head>
        <title>QR Code pour Mobile Money : MTN, Moov, Celtiis</title>
        <meta name="description" content="Utilisez un QR Code pour accepter les paiements Mobile Money au Bénin." />
        <meta name="keywords" content="QR code Mobile Money, MTN Moov Celtiis, QR code Benin" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="QR Code pour Mobile Money : MTN, Moov, Celtiis" />
        <meta property="og:description" content="Guide pour générer un QR Code Mobile Money au Bénin et à Cotonou." />
        <meta property="og:image" content="https://qr.genius.bj/preview.png" />
        <meta property="og:url" content="https://qr.genius.bj/blog/qr-code-mobile-money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QR Code pour Mobile Money : MTN, Moov, Celtiis" />
        <meta name="twitter:description" content="Acceptez les paiements mobiles facilement grâce aux QR codes." />
        <meta name="twitter:image" content="https://qr.genius.bj/preview.png" />
      </Head>
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <h1>QR Code pour Mobile Money : MTN, Moov, Celtiis</h1>
        <p>
          Les paiements mobiles deviennent incontournables à Cotonou, au Bénin et partout en Afrique de l’Ouest. Un QR code
          permet de recevoir facilement de l’argent via MTN, Moov ou Celtiis.
        </p>
        <h2>Pourquoi utiliser un QR Code pour les paiements ?</h2>
        <p>Plus rapide que le cash, idéal pour les petites entreprises et les marchands ambulants.</p>
        <h2>Comment générer votre code ?</h2>
        <p>
          Rendez-vous sur notre <Link href="/designer" className="underline">générateur de QR code</Link>, choisissez l’option
          Mobile Money puis partagez le code avec vos clients.
        </p>
        <p>
          Pour aller plus loin, lisez <Link href="/blog/qr-code-gratuit-benin" className="underline">comment créer un QR Code gratuit au Bénin</Link>
          et découvrez <Link href="/blog/qr-code-entreprises-benin" className="underline">10 utilisations des QR Codes pour les entreprises béninoises</Link>.
        </p>
      </main>
    </>
  );
}
