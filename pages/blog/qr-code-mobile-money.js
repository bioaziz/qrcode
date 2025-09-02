import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function QrCodeMobileMoney() {
  const [selectedOperator, setSelectedOperator] = useState('mtn');
  const [activeTab, setActiveTab] = useState('merchant');

  const operators = [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      color: 'yellow',
      logo: '📱',
      market_share: '68%',
      users: '5.2M',
      features: ['Paiement instantané', 'Frais réduits', 'API disponible', 'QR codes natifs']
    },
    {
      id: 'moov',
      name: 'Moov Money',
      color: 'blue',
      logo: '💙',
      market_share: '28%',
      users: '2.1M',
      features: ['Interface simple', 'Sécurité renforcée', 'Support 24/7', 'Intégration facile']
    },
    {
      id: 'celtiis',
      name: 'Celtiis Cash',
      color: 'green',
      logo: '🌟',
      market_share: '4%',
      users: '0.3M',
      features: ['Innovation constante', 'Tarifs compétitifs', 'Services bancaires', 'QR personnalisés']
    }
  ];

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
      <main className="max-w-5xl mx-auto p-6 space-y-8 bg-white">
        {/* Header */}
        <header className="text-center py-8 border-b border-gray-200">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            💳 Mobile Money • 🇧🇯 Spécial Bénin
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            QR Code pour Mobile Money : MTN, Moov, Celtiis
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl mx-auto">
            Guide complet pour accepter les paiements mobiles avec des QR codes au Bénin.
            Augmentez vos ventes, réduisez les risques et modernisez votre commerce.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>📅 Janvier 2025</span>
            <span>⏱️ 12 min de lecture</span>
            <span>🎯 Guide technique</span>
            <span>🔥 +156% adoption en 2024</span>
          </div>
        </header>

        {/* Market Overview */}
        <section className="bg-gradient-to-r from-blue-50 via-green-50 to-yellow-50 p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">📊 Le Mobile Money au Bénin en chiffres</h2>

          <div className="grid md:grid-cols-4 gap-6 text-center mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">7.5M</div>
              <div className="text-gray-700">Utilisateurs actifs</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">89%</div>
              <div className="text-gray-700">Transactions numériques</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">156%</div>
              <div className="text-gray-700">Croissance QR codes</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-orange-600 mb-2">2.4B</div>
              <div className="text-gray-700">FCFA/mois transigés</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🏆 Parts de marché des opérateurs</h3>
            <div className="space-y-3">
              {operators.map((operator) => (
                <div key={operator.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{operator.logo}</span>
                    <span className="font-medium text-gray-800">{operator.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{operator.users} utilisateurs</span>
                    <div className="bg-gray-200 rounded-full w-24 h-2">
                      <div
                        className={`bg-${operator.color}-500 h-2 rounded-full`}
                        style={{ width: operator.market_share }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-800 w-12">{operator.market_share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why QR Codes */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">
            🤔 Pourquoi utiliser des QR codes pour Mobile Money ?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Avantages pour votre business</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-green-800 mb-2">💰 Augmentation des ventes</h4>
                  <p className="text-green-700 text-sm">
                    +45% de ventes en moyenne. Les clients paient plus facilement quand c'est simple et rapide.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🔒 Sécurité maximale</h4>
                  <p className="text-blue-700 text-sm">
                    Fini les risques de vol d'espèces. Toutes les transactions sont sécurisées et tracées.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">⚡ Rapidité</h4>
                  <p className="text-purple-700 text-sm">
                    Paiement en 15 secondes maximum. Plus d'attente pour la monnaie ou la vérification des billets.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">📊 Comptabilité automatique</h4>
                  <p className="text-orange-700 text-sm">
                    Historique complet des ventes. Fini les erreurs de caisse et la gestion manuelle.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">😊 Avantages pour vos clients</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">📱</span>
                    <h4 className="font-semibold text-yellow-800">Simplicité d'usage</h4>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Un simple scan et c'est payé. Même nos grands-parents s'y habituent rapidement !
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">💸</span>
                    <h4 className="font-semibold text-red-800">Pas d'espèces nécessaires</h4>
                  </div>
                  <p className="text-red-700 text-sm">
                    Plus besoin de chercher la monnaie exacte ou de refuser un achat par manque de liquide.
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🧾</span>
                    <h4 className="font-semibold text-indigo-800">Preuve automatique</h4>
                  </div>
                  <p className="text-indigo-700 text-sm">
                    SMS de confirmation instantané. Parfait pour les dépenses professionnelles.
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🌍</span>
                    <h4 className="font-semibold text-teal-800">Accepté partout</h4>
                  </div>
                  <p className="text-teal-700 text-sm">
                    Même principe de Cotonou à Ouagadougou. Idéal pour les voyageurs d'affaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operator Comparison */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">
            ⚖️ Comparaison des opérateurs Mobile Money
          </h2>

          {/* Operator Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {operators.map((operator) => (
                <button
                  key={operator.id}
                  onClick={() => setSelectedOperator(operator.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors font-medium ${
                    selectedOperator === operator.id 
                      ? `bg-${operator.color}-500 text-white shadow-md` 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{operator.logo}</span>
                  <span className="hidden md:inline">{operator.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Operator Details */}
          {operators.map((operator) => (
            selectedOperator === operator.id && (
              <div key={operator.id} className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <span className="text-4xl">{operator.logo}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{operator.name}</h3>
                        <p className="text-gray-600">{operator.market_share} du marché • {operator.users} utilisateurs</p>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Fonctionnalités principales</h4>
                    <ul className="space-y-2">
                      {operator.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    {operator.id === 'mtn' && (
                      <>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-yellow-800 mb-4">💡 Spécificités MTN</h4>
                          <ul className="space-y-2 text-yellow-700 text-sm">
                            <li>• Leader incontesté avec 68% du marché</li>
                            <li>• API développeur la plus complète</li>
                            <li>• QR codes générés directement dans l'app</li>
                            <li>• Partenariats avec la plupart des banques</li>
                            <li>• Support technique 24/7 en français</li>
                          </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">💰 Structure tarifaire :</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div className="flex justify-between">
                              <span>0 - 1,000 FCFA :</span>
                              <span className="font-medium">Gratuit</span>
                            </div>
                            <div className="flex justify-between">
                              <span>1,001 - 10,000 FCFA :</span>
                              <span className="font-medium">1% (max 100 FCFA)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>10,001 - 50,000 FCFA :</span>
                              <span className="font-medium">0.8% (max 400 FCFA)</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {operator.id === 'moov' && (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-blue-800 mb-4">💡 Spécificités Moov</h4>
                          <ul className="space-y-2 text-blue-700 text-sm">
                            <li>• Interface utilisateur la plus intuitive</li>
                            <li>• Sécurité renforcée avec double authentification</li>
                            <li>• Intégration bancaire Orange Bank</li>
                            <li>• QR codes personnalisables avec logo</li>
                            <li>• Service client réactif et disponible</li>
                          </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">💰 Structure tarifaire :</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div className="flex justify-between">
                              <span>0 - 2,000 FCFA :</span>
                              <span className="font-medium">Gratuit</span>
                            </div>
                            <div className="flex justify-between">
                              <span>2,001 - 15,000 FCFA :</span>
                              <span className="font-medium">0.9% (max 135 FCFA)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>15,001+ FCFA :</span>
                              <span className="font-medium">0.7% (max 500 FCFA)</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {operator.id === 'celtiis' && (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-green-800 mb-4">💡 Spécificités Celtiis</h4>
                          <ul className="space-y-2 text-green-700 text-sm">
                            <li>• Innovation constante et fonctionnalités avancées</li>
                            <li>• Tarifs très compétitifs pour attirer clientèle</li>
                            <li>• Services bancaires intégrés (épargne, crédit)</li>
                            <li>• QR codes avec analytics avancées</li>
                            <li>• Partenariats avec fintech locales</li>
                          </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded p-4">
                          <h5 className="font-semibold text-gray-800 mb-2">💰 Structure tarifaire :</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div className="flex justify-between">
                              <span>0 - 5,000 FCFA :</span>
                              <span className="font-medium">Gratuit</span>
                            </div>
                            <div className="flex justify-between">
                              <span>5,001 - 25,000 FCFA :</span>
                              <span className="font-medium">0.5% (max 125 FCFA)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>25,001+ FCFA :</span>
                              <span className="font-medium">0.4% (max 300 FCFA)</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          ))}
        </section>

        {/* Implementation Guide */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">
            🛠️ Comment créer vos QR codes Mobile Money
          </h2>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('merchant')}
                className={`px-6 py-3 rounded-md transition-colors font-medium ${
                  activeTab === 'merchant' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏪 Commerçant
              </button>
              <button
                onClick={() => setActiveTab('individual')}
                className={`px-6 py-3 rounded-md transition-colors font-medium ${
                  activeTab === 'individual' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                👤 Particulier
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-6 py-3 rounded-md transition-colors font-medium ${
                  activeTab === 'advanced' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚡ Avancé
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'merchant' && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">🏪 Solutions pour commerçants</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Étapes d'inscription marchande</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h5 className="font-semibold text-gray-800">Inscription compte marchand</h5>
                        <p className="text-gray-600 text-sm">Rendez-vous dans une agence avec pièce d'identité et justificatif d'activité</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h5 className="font-semibold text-gray-800">Validation du dossier</h5>
                        <p className="text-gray-600 text-sm">24-48h pour validation. SMS de confirmation avec identifiant marchand</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h5 className="font-semibold text-gray-800">Génération QR codes</h5>
                        <p className="text-gray-600 text-sm">Via l'application ou notre générateur avec votre ID marchand</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h5 className="font-semibold text-gray-800">Déploiement</h5>
                        <p className="text-gray-600 text-sm">Impression et affichage dans votre point de vente</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">💼 Documents nécessaires</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h5 className="font-semibold text-yellow-800 mb-3">📄 Pièces à fournir :</h5>
                    <ul className="space-y-2 text-yellow-700 text-sm">
                      <li>• Carte d'identité nationale ou passeport</li>
                      <li>• Registre de commerce ou patente</li>
                      <li>• Justificatif de domicile (moins de 3 mois)</li>
                      <li>• Photo d'identité récente</li>
                      <li>• Attestation bancaire (optionnel)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
                    <h5 className="font-semibold text-blue-800 mb-3">⚡ Accélération du processus :</h5>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li>• Dossier complet = validation en 24h</li>
                      <li>• Parrainage par marchand existant</li>
                      <li>• Volume d'affaires prévisionnels élevés</li>
                      <li>• Secteur d'activité prioritaire (santé, éducation)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Types de QR codes marchands</h4>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">🔧 QR Statique</h5>
                    <p className="text-gray-600 text-sm mb-3">Montant fixe, idéal pour produits standards</p>
                    <div className="bg-gray-100 p-2 rounded text-xs">
                      <code>mtn://pay?merchant=BEN123&amount=2500</code>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">⚡ QR Dynamique</h5>
                    <p className="text-gray-600 text-sm mb-3">Client saisit le montant, plus flexible</p>
                    <div className="bg-gray-100 p-2 rounded text-xs">
                      <code>mtn://pay?merchant=BEN123</code>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">📊 QR Analytics</h5>
                    <p className="text-gray-600 text-sm mb-3">Suivi détaillé des transactions</p>
                    <div className="bg-gray-100 p-2 rounded text-xs">
                      <code>custom://track?id=ABC123</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'individual' && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">👤 Solutions pour particuliers</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">🚀 Création rapide (5 min)</h4>
                  <div className="space-y-4">
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <h5 className="font-semibold text-green-800 mb-2">1. Ouvrez votre app Mobile Money</h5>
                      <p className="text-green-700 text-sm">MTN MoMo, Moov Money ou Celtiis selon votre opérateur</p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <h5 className="font-semibold text-blue-800 mb-2">2. Accédez à "Recevoir de l'argent"</h5>
                      <p className="text-blue-700 text-sm">Section "QR Code" ou "Code à barres" selon l'interface</p>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                      <h5 className="font-semibold text-purple-800 mb-2">3. Générez votre QR personnel</h5>
                      <p className="text-purple-700 text-sm">Code lié à votre numéro, partage instantané possible</p>
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                      <h5 className="font-semibold text-orange-800 mb-2">4. Sauvegardez et partagez</h5>
                      <p className="text-orange-700 text-sm">Screenshot, impression, ou envoi direct par WhatsApp</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">💡 Cas d'usage populaires</h4>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">🛒</span>
                        <h5 className="font-semibold text-yellow-800">Ventes occasionnelles</h5>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Vendre sur Facebook Marketplace, groupes WhatsApp, ou marchés temporaires
                      </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">🎓</span>
                        <h5 className="font-semibold text-red-800">Services freelance</h5>
                      </div>
                      <p className="text-red-700 text-sm">
                        Graphisme, traduction, cours particuliers, réparations
                      </p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">🎉</span>
                        <h5 className="font-semibold text-indigo-800">Événements familiaux</h5>
                      </div>
                      <p className="text-indigo-700 text-sm">
                        Cotisations mariages, baptêmes, contributions funérailles
                      </p>
                    </div>

                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">🤝</span>
                        <h5 className="font-semibold text-teal-800">Remboursements entre amis</h5>
                      </div>
                      <p className="text-teal-700 text-sm">
                        Partage d'addition au restaurant, remboursement d'avances
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Limites pour particuliers</h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-3">💰 Plafonds de transaction :</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>MTN MoMo :</span>
                        <span className="font-medium">200,000 FCFA/jour</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>Moov Money :</span>
                        <span className="font-medium">150,000 FCFA/jour</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span>Celtiis Cash :</span>
                        <span className="font-medium">250,000 FCFA/jour</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-3">🔐 Sécurité renforcée :</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Code PIN obligatoire pour chaque transaction</li>
                      <li>• SMS de confirmation automatique</li>
                      <li>• Blocage après 3 tentatives erronées</li>
                      <li>• Historique consultable 12 mois</li>
                      <li>• Support client 24/7 en cas de problème</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">⚡ Solutions avancées et intégrations</h3>

              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">🔌 Intégrations API</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h5 className="font-semibold text-blue-800 mb-3">MTN MoMo API</h5>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border">
                          <code className="text-xs text-gray-800">
                            POST https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay<br/>
                            Authorization: Bearer {'{'}access_token{'}'}<br/>
                            Content-Type: application/json
                          </code>
                        </div>
                        <p className="text-blue-700 text-sm">
                          Documentation complète, sandbox gratuit, support développeur réactif
                        </p>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h5 className="font-semibold text-orange-800 mb-3">Moov Money API</h5>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border">
                          <code className="text-xs text-gray-800">
                            POST https://api.moov-africa.com/v1/payments<br/>
                            X-API-Key: {'{'}your_api_key{'}'}<br/>
                            Content-Type: application/json
                          </code>
                        </div>
                        <p className="text-orange-700 text-sm">
                          API REST simple, webhooks disponibles, tests automatisés
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Outils de développement</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                      <h5 className="font-semibold text-green-800 mb-2">SDK JavaScript</h5>
                      <div className="bg-white p-2 rounded text-xs mb-3">
                        <code>npm install mtn-momo-sdk</code>
                      </div>
                      <p className="text-green-700 text-sm">React, Vue, Angular compatibles</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded p-4">
                      <h5 className="font-semibold text-purple-800 mb-2">SDK PHP</h5>
                      <div className="bg-white p-2 rounded text-xs mb-3">
                        <code>composer require momo/sdk</code>
                      </div>
                      <p className="text-purple-700 text-sm">Laravel, WordPress plugins</p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded p-4">
                      <h5 className="font-semibold text-red-800 mb-2">SDK Python</h5>
                      <div className="bg-white p-2 rounded text-xs mb-3">
                        <code>pip install momo-api</code>
                      </div>
                      <p className="text-red-700 text-sm">Django, Flask intégrations</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Analytics et reporting</h4>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-indigo-800 mb-3">📈 Métriques disponibles :</h5>
                        <ul className="space-y-1 text-indigo-700 text-sm">
                          <li>• Volume de transactions par jour/semaine/mois</li>
                          <li>• Montants moyens par transaction</li>
                          <li>• Taux de succès des paiements</li>
                          <li>• Répartition par opérateur</li>
                          <li>• Géolocalisation des transactions</li>
                          <li>• Heures de pic d'activité</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-purple-800 mb-3">📋 Exports disponibles :</h5>
                        <ul className="space-y-1 text-purple-700 text-sm">
                          <li>• CSV pour comptabilité</li>
                          <li>• PDF pour rapports mensuels</li>
                          <li>• JSON pour intégrations techniques</li>
                          <li>• Envoi automatique par email</li>
                          <li>• API pour dashboards personnalisés</li>
                          <li>• Intégration Google Analytics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Success Stories */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">
            🎉 Témoignages de réussite
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  RT
                </div>
                <div className="flex-1">
                  <blockquote className="text-gray-800 mb-4">
                    "Depuis que j'accepte Mobile Money avec QR codes, mes ventes ont explosé ! +78% en 6 mois.
                    Mes clients préfèrent largement payer par téléphone, surtout les jeunes."
                  </blockquote>
                  <cite className="text-gray-600">
                    <strong>Rachelle TOSSOU</strong><br/>
                    <span className="text-sm">Pharmacie "Santé Plus" - Cotonou</span><br/>
                    <span className="text-xs text-green-600">• 12,000+ transactions/mois</span>
                  </cite>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  MK
                </div>
                <div className="flex-1">
                  <blockquote className="text-gray-800 mb-4">
                    "Les QR codes ont révolutionné notre restaurant. Plus de problème de monnaie,
                    paiements ultra-rapides. On a même des clients qui viennent spécifiquement pour ça !"
                  </blockquote>
                  <cite className="text-gray-600">
                    <strong>Marcel KOUDJO</strong><br/>
                    <span className="text-sm">Restaurant "Le Palmier" - Parakou</span><br/>
                    <span className="text-xs text-blue-600">• 89% paiements digitaux</span>
                  </cite>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SA
                </div>
                <div className="flex-1">
                  <blockquote className="text-gray-800 mb-4">
                    "Mon salon de coiffure moderne accepte tous les Mobile Money via QR.
                    Les clientes adorent ! Fini les allers-retours à la banque pour récupérer l'argent."
                  </blockquote>
                  <cite className="text-gray-600">
                    <strong>Sylvie AGBO</strong><br/>
                    <span className="text-sm">Salon "Beauty Queen" - Porto-Novo</span><br/>
                    <span className="text-xs text-purple-600">• 156% croissance clientèle</span>
                  </cite>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-lg border">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  JD
                </div>
                <div className="flex-1">
                  <blockquote className="text-gray-800 mb-4">
                    "Mes étudiants paient leurs cours par QR code. Plus simple pour eux,
                    plus sûr pour moi. J'ai même créé des codes différents par matière !"
                  </blockquote>
                  <cite className="text-gray-600">
                    <strong>Jean DOSSOU</strong><br/>
                    <span className="text-sm">Cours particuliers de mathématiques</span><br/>
                    <span className="text-xs text-orange-600">• 45 étudiants réguliers</span>
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">
            🔧 Résolution de problèmes courants
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">❌ Problèmes fréquents</h3>

              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <h4 className="font-semibold text-red-800 mb-2">QR code ne fonctionne pas</h4>
                  <div className="text-red-700 text-sm space-y-1">
                    <p><strong>Symptômes :</strong> Erreur "Code invalide" ou "Service temporairement indisponible"</p>
                    <p><strong>Causes :</strong> Format incorrect, compte suspendu, réseau faible</p>
                  </div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Transaction échouée</h4>
                  <div className="text-orange-700 text-sm space-y-1">
                    <p><strong>Symptômes :</strong> Argent débité mais pas reçu</p>
                    <p><strong>Causes :</strong> Solde insuffisant, plafond dépassé, compte non vérifié</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">QR code illisible</h4>
                  <div className="text-yellow-700 text-sm space-y-1">
                    <p><strong>Symptômes :</strong> Appareil photo ne détecte pas le code</p>
                    <p><strong>Causes :</strong> Qualité d'impression, éclairage, distance</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">✅ Solutions rapides</h3>

              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Vérifications basiques</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Connexion internet stable (3G/4G/WiFi)</li>
                    <li>• Application Mobile Money à jour</li>
                    <li>• Solde suffisant sur le compte</li>
                    <li>• Numéro de téléphone actif</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Tests recommandés</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Scanner avec 2-3 téléphones différents</li>
                    <li>• Tester à différents moments de la journée</li>
                    <li>• Vérifier la qualité d'impression</li>
                    <li>• Confirmer avec une petite transaction</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Support client</h4>
                  <div className="text-purple-700 text-sm space-y-1">
                    <p><strong>MTN :</strong> *155# ou +229 69 00 00 00</p>
                    <p><strong>Moov :</strong> *155*2# ou +229 96 96 96 96</p>
                    <p><strong>Celtiis :</strong> *124# ou +229 62 00 62 00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="bg-red-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🔐 Sécurité et bonnes pratiques</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-red-200">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-semibold mb-3 text-red-800">Vigilance constante</h3>
              <ul className="text-red-700 text-sm space-y-2">
                <li>• Ne jamais partager votre code PIN</li>
                <li>• Vérifier l'identité avant transaction importante</li>
                <li>• Signaler immédiatement toute anomalie</li>
                <li>• Garder votre téléphone verrouillé</li>
                <li>• Éviter les réseaux WiFi publics</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-yellow-200">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-800">Prévention des fraudes</h3>
              <ul className="text-yellow-700 text-sm space-y-2">
                <li>• Méfiance avec les montants inhabituels</li>
                <li>• Double vérification pour nouveaux clients</li>
                <li>• Limites de transaction quotidiennes</li>
                <li>• Surveillance des tentatives répétées</li>
                <li>• Formation du personnel à la sécurité</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-green-200">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-3 text-green-800">Bonnes pratiques</h3>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• Sauvegarde régulière des QR codes</li>
                <li>• Mise à jour automatique des apps</li>
                <li>• Vérification périodique des soldes</li>
                <li>• Documentation des transactions importantes</li>
                <li>• Formation continue sur les nouveautés</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white rounded-xl">
          <h2 className="text-3xl font-bold mb-4">🚀 Prêt à révolutionner vos paiements ?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Rejoignez les milliers d'entrepreneurs béninois qui ont déjà adopté les QR codes Mobile Money.
            Augmentez vos ventes, sécurisez vos transactions, et offrez une expérience moderne à vos clients !
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/designer"
                  className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg">
              🎨 Créer mon QR Code Mobile Money
            </Link>
            <Link href="/blog/qr-code-gratuit-benin"
                  className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              📖 Guide débutant complet
            </Link>
          </div>

          <div className="mt-8 space-y-2 text-sm opacity-90">
            <p>⚡ Configuration en 5 minutes • 🔒 100% sécurisé • 💳 Compatible tous opérateurs</p>
            <p>✨ Gratuit • ⭐ Support en français • 🇧🇯 Testé partout au Bénin</p>
          </div>
        </section>

        {/* Related Articles */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">
            📚 Articles complémentaires
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/qr-code-gratuit-benin"
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🆓</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                Créer QR codes gratuits
              </h3>
              <p className="text-gray-600 mb-4">
                Guide complet pour générer tous types de QR codes sans frais au Bénin.
              </p>
              <div className="text-green-600 font-medium text-sm">
                Lire le tutoriel →
              </div>
            </Link>

            <Link href="/blog/qr-code-entreprises-benin"
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                10 usages business QR codes
              </h3>
              <p className="text-gray-600 mb-4">
                Découvrez toutes les façons d'utiliser les QR codes dans votre entreprise.
              </p>
              <div className="text-blue-600 font-medium text-sm">
                Explorer les usages →
              </div>
            </Link>

            <Link href="/blog/qr-code-restaurant-menu"
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                Menus digitaux restaurant
              </h3>
              <p className="text-gray-600 mb-4">
                Créez des menus numériques modernes avec QR codes pour votre restaurant.
              </p>
              <div className="text-orange-600 font-medium text-sm">
                Guide restaurant →
              </div>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">📱</span>
                <span className="text-sm text-gray-600">MTN Mobile Money</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="