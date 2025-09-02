import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function QrCodeGratuitBenin() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Choisir le type de QR Code",
      description: "Sélectionnez ce que vous voulez partager"
    },
    {
      id: 2,
      title: "Saisir vos informations",
      description: "Entrez le contenu à encoder"
    },
    {
      id: 3,
      title: "Personnaliser le design",
      description: "Ajoutez couleurs et logo"
    },
    {
      id: 4,
      title: "Télécharger et utiliser",
      description: "Récupérez votre QR code"
    }
  ];

  return (
    <>
      <Head>
        <title>Comment créer un QR Code gratuit au Bénin</title>
        <meta name="description" content="Guide simple pour créer un QR Code gratuit au Bénin et à Cotonou." />
        <meta name="keywords" content="QR code gratuit, QR code Benin, créer QR code, QR code Afrique de l'Ouest" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Comment créer un QR Code gratuit au Bénin" />
        <meta property="og:description" content="Apprenez à générer un QR Code gratuit pour votre entreprise ou projet au Bénin." />
        <meta property="og:image" content="https://qr.genius.bj/preview.png" />
        <meta property="og:url" content="https://qr.genius.bj/blog/qr-code-gratuit-benin" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Comment créer un QR Code gratuit au Bénin" />
        <meta name="twitter:description" content="Tutoriel pour générer un QR Code gratuit et rapide." />
        <meta name="twitter:image" content="https://qr.genius.bj/preview.png" />
      </Head>
      <main className="max-w-4xl mx-auto p-6 space-y-8 bg-white">
        {/* Header */}
        <header className="text-center py-8 border-b border-gray-200">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🆓 100% Gratuit • Pas d'inscription requise
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comment créer un QR Code gratuit au Bénin
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Guide complet et pratique pour générer vos QR codes en quelques minutes,
            que vous soyez à Cotonou, Porto-Novo, Parakou ou partout ailleurs au Bénin
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>📅 Mis à jour le 15 janvier 2025</span>
            <span>⏱️ 5 min de lecture</span>
            <span>🎯 Guide pratique</span>
          </div>
        </header>

        {/* Quick Start CTA */}
        <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">🚀 Créez votre QR Code maintenant</h2>
          <p className="text-lg mb-6 opacity-90">
            Pas le temps de lire ? Créez directement votre QR code gratuit en 30 secondes !
          </p>
          <Link href="/designer"
                className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
            🎨 Générateur gratuit →
          </Link>
        </section>

        {/* Introduction */}
        <section className="prose prose-lg max-w-none">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
            <p className="text-lg leading-relaxed text-gray-800">
              <strong>Pourquoi les QR codes sont-ils si populaires au Bénin ?</strong><br/>
              Avec plus de 8 millions d'utilisateurs de smartphones au Bénin et l'essor du Mobile Money,
              les QR codes sont devenus un outil indispensable pour les entreprises, les artisans,
              et même les particuliers qui souhaitent partager facilement des informations.
            </p>
          </div>

          <p className="text-lg leading-relaxed">
            Contrairement à ce que beaucoup pensent, créer un QR code professionnel ne nécessite aucune
            compétence technique particulière. En quelques clics, vous pouvez générer un code personnalisé
            qui fonctionnera parfaitement sur tous les smartphones vendus à Cotonou, Parakou, ou dans
            toute l'Afrique de l'Ouest.
          </p>
        </section>

        {/* What is QR Code Section */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🤔 Qu'est-ce qu'un QR Code exactement ?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Définition simple</h3>
              <p className="text-gray-700 mb-4">
                QR signifie "Quick Response" (Réponse Rapide). C'est un carré noir et blanc qui peut stocker
                jusqu'à 4 296 caractères de texte - suffisant pour une URL complète, un numéro de téléphone,
                ou même un petit texte.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Comment ça fonctionne ?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span className="text-gray-700">Vous créez le QR code avec vos informations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span className="text-gray-700">Vos clients scannent avec leur téléphone</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span className="text-gray-700">L'action se déclenche automatiquement</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Types de QR codes populaires au Bénin</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="text-green-600">🌐</span>
                  <span><strong>Site web :</strong> Diriger vers votre site ou boutique en ligne</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-blue-600">📱</span>
                  <span><strong>WhatsApp :</strong> Lancer une conversation directe</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-purple-600">💳</span>
                  <span><strong>Mobile Money :</strong> Recevoir des paiements MTN/Moov</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-orange-600">📞</span>
                  <span><strong>Contact :</strong> Ajouter vos infos au téléphone</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-red-600">🍽️</span>
                  <span><strong>Menu :</strong> Afficher la carte de votre restaurant</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step by Step Guide */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            📋 Guide étape par étape (4 étapes simples)
          </h2>

          {/* Progress Bar */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeStep === step.id 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <span className="font-bold">{step.id}</span>
                  <span className="hidden md:inline">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {activeStep === 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">1</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Choisir le type de QR Code</h3>
                  <p className="text-gray-600">Sélectionnez ce que vous voulez partager avec vos clients</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Options les plus utilisées au Bénin :</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800 mb-2">🌐 Site Web / Lien</h5>
                      <p className="text-blue-700 text-sm">
                        Pour diriger vers votre site, boutique Facebook, ou page Instagram
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-semibold text-green-800 mb-2">📱 WhatsApp Business</h5>
                      <p className="text-green-700 text-sm">
                        Permettre aux clients de vous contacter directement
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-800 mb-2">💳 Paiement Mobile Money</h5>
                      <p className="text-purple-700 text-sm">
                        Recevoir des paiements MTN Mobile Money ou Moov Money
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">💡 Conseil pratique</h4>
                  <p className="text-gray-700 mb-4">
                    <strong>Débutant ?</strong> Commencez par un QR code WhatsApp. C'est le plus simple
                    et le plus utilisé au Bénin. Vos clients pourront vous contacter en un clic !
                  </p>
                  <div className="bg-white border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-600">
                      <strong>Format WhatsApp :</strong><br/>
                      wa.me/22901234567<br/>
                      (remplacez par votre numéro béninois)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">2</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Saisir vos informations</h3>
                  <p className="text-gray-600">Entrez le contenu à encoder dans votre QR code</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Exemples concrets pour le Bénin :</h4>

                  <div className="space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <h5 className="font-semibold text-blue-800">Restaurant à Cotonou</h5>
                      <p className="text-blue-700 text-sm mb-2">QR code pour menu :</p>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        https://menu-restaurant-benin.com/saveurs-africaines
                      </code>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <h5 className="font-semibold text-green-800">Boutique de tissu</h5>
                      <p className="text-green-700 text-sm mb-2">WhatsApp pour commandes :</p>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        wa.me/22901234567?text=Bonjour, je veux voir vos pagnes
                      </code>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                      <h5 className="font-semibold text-purple-800">Taxi-moto (Zémidjan)</h5>
                      <p className="text-purple-700 text-sm mb-2">Contact direct :</p>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        BEGIN:VCARD
                        FN:Koffi Transport
                        TEL:+22901234567
                        END:VCARD
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-4">⚠️ Erreurs à éviter</h4>

                  <ul className="space-y-3 text-yellow-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span><strong>URL incomplète :</strong> Écrivez "https://..." pas juste "www..."</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span><strong>Numéro incorrect :</strong> Format international : +229...</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span><strong>Trop d'infos :</strong> Un QR code = une action simple</span>
                    </li>
                  </ul>

                  <div className="mt-4 pt-4 border-t border-yellow-300">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Astuce :</strong> Testez toujours votre QR code avant impression
                      en le scannant avec votre téléphone !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">3</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Personnaliser le design</h3>
                  <p className="text-gray-600">Rendez votre QR code unique et professionnel</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-4">🎨 Couleurs</h4>
                  <ul className="space-y-2 text-red-700 text-sm">
                    <li>• Couleurs du drapeau béninois (vert, jaune, rouge)</li>
                    <li>• Couleurs de votre marque</li>
                    <li>• Contraste suffisant pour la lecture</li>
                    <li>• Évitez le blanc sur blanc !</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">🖼️ Logo</h4>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Logo de votre entreprise au centre</li>
                    <li>• Taille maximum : 20% du QR code</li>
                    <li>• Format PNG avec fond transparent</li>
                    <li>• Reste lisible même avec logo</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">📐 Format</h4>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• PNG pour impression (haute qualité)</li>
                    <li>• SVG pour redimensionnement</li>
                    <li>• Minimum 300x300 pixels</li>
                    <li>• Marge blanche autour du code</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">🇧🇯 Inspiration design "Made in Bénin"</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Couleurs populaires :</h5>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-green-600 rounded border-2 border-white shadow-sm"></div>
                      <div className="w-8 h-8 bg-yellow-500 rounded border-2 border-white shadow-sm"></div>
                      <div className="w-8 h-8 bg-red-600 rounded border-2 border-white shadow-sm"></div>
                      <div className="w-8 h-8 bg-orange-600 rounded border-2 border-white shadow-sm"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm">
                      <strong>Conseil :</strong> Un QR code vert foncé sur fond blanc reste
                      le plus professionnel et le plus lisible sur tous les téléphones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">4</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Télécharger et utiliser</h3>
                  <p className="text-gray-600">Récupérez votre QR code et commencez à l'utiliser</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📥 Téléchargement</h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <h5 className="font-semibold text-blue-800 mb-2">Formats disponibles :</h5>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• <strong>PNG :</strong> Pour impression (affiches, cartes)</li>
                        <li>• <strong>SVG :</strong> Pour redimensionnement sans perte</li>
                        <li>• <strong>JPG :</strong> Pour partage sur réseaux sociaux</li>
                        <li>• <strong>PDF :</strong> Pour impression professionnelle</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-4">
                      <h5 className="font-semibold text-green-800 mb-2">Tailles recommandées :</h5>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• <strong>Carte de visite :</strong> 2x2 cm minimum</li>
                        <li>• <strong>Affiche :</strong> 5x5 cm minimum</li>
                        <li>• <strong>Écran :</strong> 512x512 pixels</li>
                        <li>• <strong>Impression :</strong> 300 DPI minimum</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">🚀 Mise en pratique</h4>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                      <h5 className="font-semibold text-yellow-800 mb-2">Où placer votre QR code :</h5>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Devanture de votre magasin</li>
                        <li>• Cartes de visite</li>
                        <li>• Factures et reçus</li>
                        <li>• Réseaux sociaux</li>
                        <li>• Emballages produits</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded p-4">
                      <h5 className="font-semibold text-purple-800 mb-2">Test avant utilisation :</h5>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>✓ Scanner avec plusieurs téléphones</li>
                        <li>✓ Vérifier la rapidité de lecture</li>
                        <li>✓ Tester à différentes distances</li>
                        <li>✓ Confirmer l'action souhaitée</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Common Use Cases in Benin */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">
            🇧🇯 Utilisations populaires au Bénin
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Restaurants</h3>
              <p className="text-gray-600 mb-4">
                Menu numérique, commandes en ligne, avis clients. Très populaire depuis COVID.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="text-orange-800 text-sm font-medium">💰 Impact :</p>
                <p className="text-orange-700 text-sm">+45% de commandes en moyenne</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Commerce</h3>
              <p className="text-gray-600 mb-4">
                Catalogue produits, paiement Mobile Money, contact WhatsApp direct.
              </p>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800 text-sm font-medium">📱 Populaire :</p>
                <p className="text-green-700 text-sm">WhatsApp Business intégré</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Santé</h3>
              <p className="text-gray-600 mb-4">
                Prendre RDV, accéder aux résultats, information patients.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-blue-800 text-sm font-medium">⏰ Gain temps :</p>
                <p className="text-blue-700 text-sm">-60% temps d'attente</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Éducation</h3>
              <p className="text-gray-600 mb-4">
                Cours en ligne, devoirs, communication parents-école.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="text-purple-800 text-sm font-medium">📚 Usage :</p>
                <p className="text-purple-700 text-sm">Partage ressources pédagogiques</p>