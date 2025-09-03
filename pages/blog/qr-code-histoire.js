import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function QrCodeHistory() {
  const [activeTimeline, setActiveTimeline] = useState('invention');
  const [selectedDecade, setSelectedDecade] = useState('1990s');

  const timelineEvents = [
    {
      id: 'invention',
      year: '1992-1994',
      title: 'Invention du QR Code',
      description: 'Développement chez Denso Wave par Masahiro Hara',
      color: 'blue'
    },
    {
      id: 'automotive',
      year: '1994-2000',
      title: 'Usage industriel',
      description: 'Traçabilité des pièces automobiles',
      color: 'green'
    },
    {
      id: 'mobile',
      year: '2000-2010',
      title: 'Ère mobile',
      description: 'Adoption massive au Japon et en Corée',
      color: 'purple'
    },
    {
      id: 'global',
      year: '2010-2020',
      title: 'Expansion mondiale',
      description: 'Intégration dans les smartphones',
      color: 'orange'
    },
    {
      id: 'pandemic',
      year: '2020-2025',
      title: 'Révolution COVID',
      description: 'Usage quotidien et paiements sans contact',
      color: 'red'
    }
  ];

  const decades = [
    {
      id: '1990s',
      title: 'Années 1990',
      subtitle: 'L\'innovation',
      events: [
        { year: '1992', event: 'Début du développement chez Denso Wave', impact: 'Recherche pour remplacer les codes-barres' },
        { year: '1994', event: 'Première version du QR Code', impact: 'Capacité de 7 000 caractères' },
        { year: '1997', event: 'Standardisation ISO/IEC', impact: 'Reconnaissance internationale' }
      ]
    },
    {
      id: '2000s',
      title: 'Années 2000',
      subtitle: 'L\'adoption',
      events: [
        { year: '2002', event: 'Premiers téléphones avec lecteur QR', impact: 'Sharp J-SH09 au Japon' },
        { year: '2005', event: 'Usage marketing massif', impact: 'Campagnes publicitaires innovantes' },
        { year: '2008', event: 'Explosion en Asie', impact: '80% des Japonais utilisent les QR codes' }
      ]
    },
    {
      id: '2010s',
      title: 'Années 2010',
      subtitle: 'La mondialisation',
      events: [
        { year: '2011', event: 'Intégration iOS et Android', impact: 'Démocratisation mondiale' },
        { year: '2016', event: 'Paiements mobiles en Chine', impact: 'WeChat Pay et Alipay' },
        { year: '2017', event: 'Lecture native dans iOS 11', impact: 'Plus besoin d\'app dédiée' }
      ]
    },
    {
      id: '2020s',
      title: 'Années 2020',
      subtitle: 'L\'omniprésence',
      events: [
        { year: '2020', event: 'Menus sans contact COVID', impact: 'Usage sanitaire obligatoire' },
        { year: '2022', event: '18 milliards de scans/an', impact: 'Croissance de 300% post-COVID' },
        { year: '2024', event: 'Intégration IA et AR', impact: 'QR codes intelligents' }
      ]
    }
  ];

  const inventors = [
    {
      name: 'Masahiro Hara',
      role: 'Inventeur principal',
      company: 'Denso Wave',
      contribution: 'Concept et développement technique',
      image: '👨‍💻',
      quote: "Je voulais créer un code qui pourrait être lu rapidement depuis n'importe quel angle."
    },
    {
      name: 'Takayuki Nagaya',
      role: 'Co-développeur',
      company: 'Denso Wave',
      contribution: 'Optimisation algorithmique',
      image: '👨‍🔬',
      quote: "L'objectif était de dépasser les limitations des codes-barres traditionnels."
    },
    {
      name: 'Équipe Denso Wave',
      role: 'Équipe de développement',
      company: 'Denso Corporation',
      contribution: 'Tests et industrialisation',
      image: '👥',
      quote: "Ensemble, nous avons créé quelque chose qui changerait le monde."
    }
  ];

  return (
    <>
      <Head>
        <title>Histoire des QR Codes : De 1994 à aujourd'hui | Guide Complet</title>
        <meta name="description" content="Découvrez l'histoire fascinante des QR codes, de leur invention en 1994 par Masahiro Hara jusqu'à leur révolution moderne." />
        <meta name="keywords" content="histoire QR code, Masahiro Hara, Denso Wave, invention QR code, évolution technologie" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Histoire des QR Codes : 30 ans d'innovation" />
        <meta property="og:description" content="L'histoire complète des QR codes, de leur création au Japon à leur adoption mondiale." />
        <meta property="og:image" content="https://qr.genius.bj/qr-history-preview.png" />
        <meta property="og:url" content="https://qr.genius.bj/blog/histoire-qr-code" />
      </Head>

      <main className="max-w-5xl mx-auto p-6 space-y-8 bg-white">
        {/* Header */}
        <header className="text-center py-8 border-b border-gray-200">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            📱 Technologie • 🇯🇵 Made in Japan • 🌍 Impact Mondial
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Histoire des QR Codes : 30 ans d'innovation révolutionnaire
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl mx-auto">
            De leur invention en 1994 dans une usine automobile japonaise à leur omniprésence actuelle :
            découvrez l'histoire fascinante des QR codes et leur impact sur notre quotidien.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>📅 30 ans d'histoire</span>
            <span>⏱️ 15 min de lecture</span>
            <span>🎯 Guide historique</span>
            <span>🔥 18 milliards de scans/an en 2024</span>
          </div>
        </header>

        {/* Key Statistics */}
        <section className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">📊 Les QR codes en chiffres aujourd'hui</h2>

          <div className="grid md:grid-cols-4 gap-6 text-center mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">18B</div>
              <div className="text-gray-700">Scans par an (2024)</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">7,089</div>
              <div className="text-gray-700">Caractères max</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">194</div>
              <div className="text-gray-700">Pays utilisateurs</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-orange-600 mb-2">30</div>
              <div className="text-gray-700">Années d'existence</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🏆 Évolution de l'adoption mondiale</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">1994-2000 : Usage industriel</span>
                <div className="bg-gray-200 rounded-full w-32 h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <span className="text-sm text-gray-600">Automobile uniquement</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">2000-2010 : Expansion Asie</span>
                <div className="bg-gray-200 rounded-full w-32 h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm text-gray-600">Japon, Corée</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">2010-2020 : Mondial</span>
                <div className="bg-gray-200 rounded-full w-32 h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm text-gray-600">Smartphones</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">2020-2024 : Omniprésent</span>
                <div className="bg-gray-200 rounded-full w-32 h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm text-gray-600">Usage quotidien</span>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            🌟 L'histoire de l'invention (1992-1994)
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🏭 Le contexte : Crise au Japon</h3>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <h4 className="font-semibold text-red-800 mb-2">💥 Éclatement de la bulle économique</h4>
                  <p className="text-red-700 text-sm">
                    Début des années 1990 : le Japon traverse sa pire crise économique depuis 1945.
                    Les entreprises cherchent de nouveaux marchés.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🚗 Denso Corporation</h4>
                  <p className="text-blue-700 text-sm">
                    Équipementier automobile de Toyota, Denso Wave cherche à diversifier ses activités
                    au-delà de l'automobile.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">📊 Problème des codes-barres</h4>
                  <p className="text-purple-700 text-sm">
                    Les codes-barres traditionnels ne stockent que 20 caractères et nécessitent
                    plusieurs codes pour les pièces complexes.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🧠 L'inspiration de Masahiro Hara</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl">👨‍💻</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Masahiro Hara</h4>
                    <p className="text-yellow-700 text-sm">Ingénieur chez Denso Wave</p>
                  </div>
                </div>

                <blockquote className="text-yellow-800 italic mb-4">
                  "En jouant au jeu de Go, j'ai réalisé que les motifs noirs et blancs
                  pouvaient encoder beaucoup plus d'informations qu'une simple ligne."
                </blockquote>

                <div className="bg-white p-4 rounded border space-y-2">
                  <h5 className="font-medium text-gray-800">🎯 Objectifs de développement :</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Lecture ultra-rapide (Quick Response)</li>
                    <li>• Capacité 100x supérieure aux codes-barres</li>
                    <li>• Résistance aux dommages physiques</li>
                    <li>• Lecture depuis tous les angles</li>
                    <li>• Gratuit et open-source</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">⚙️ Le processus de développement (1992-1994)</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h4 className="font-semibold text-gray-800 mb-3">Recherche (1992)</h4>
                <p className="text-gray-600 text-sm">
                  Analyse des motifs géométriques et étude des rapports de proportions optimaux
                  pour la détection automatique.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h4 className="font-semibold text-gray-800 mb-3">Prototypage (1993)</h4>
                <p className="text-gray-600 text-sm">
                  Création des premiers prototypes avec les motifs de positionnement caractéristiques
                  dans les coins du carré.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h4 className="font-semibold text-gray-800 mb-3">Lancement (1994)</h4>
                <p className="text-gray-600 text-sm">
                  Commercialisation du premier système QR Code avec lecteurs dédiés
                  pour l'industrie automobile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            📅 Chronologie de l'évolution
          </h2>

          {/* Timeline Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              {timelineEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setActiveTimeline(event.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors font-medium text-sm whitespace-nowrap ${
                    activeTimeline === event.id 
                      ? `bg-${event.color}-500 text-white shadow-md` 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{event.year}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Content */}
          {timelineEvents.map((event) => (
            activeTimeline === event.id && (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-6">{event.description}</p>

                    {event.id === 'invention' && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">🔬 Innovations techniques</h4>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Motifs de positionnement dans 3 coins</li>
                            <li>• Correction d'erreur Reed-Solomon</li>
                            <li>• Masques pour optimiser la lecture</li>
                            <li>• Structure modulaire extensible</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">📈 Première adoption</h4>
                          <p className="text-green-700 text-sm">
                            Kanban dans les usines Toyota pour tracer 100% des pièces détachées
                            avec une précision inégalée.
                          </p>
                        </div>
                      </div>
                    )}

                    {event.id === 'automotive' && (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">🏭 Usage industriel</h4>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Traçabilité complète des pièces</li>
                            <li>• Gestion des stocks en temps réel</li>
                            <li>• Réduction de 40% des erreurs</li>
                            <li>• Adoption par tous les constructeurs japonais</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">🌍 Expansion internationale</h4>
                          <p className="text-blue-700 text-sm">
                            Standardisation ISO/IEC 18004 en 2000, ouvrant la voie à l'adoption mondiale
                            dans tous les secteurs industriels.
                          </p>
                        </div>
                      </div>
                    )}

                    {event.id === 'mobile' && (
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-800 mb-2">📱 Révolution mobile</h4>
                          <ul className="text-purple-700 text-sm space-y-1">
                            <li>• Premier téléphone avec lecteur QR (Sharp J-SH09)</li>
                            <li>• 80% des Japonais utilisent les QR codes en 2005</li>
                            <li>• Campagnes marketing révolutionnaires</li>
                            <li>• Liens directs vers sites web mobiles</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {event.id === 'global' && (
                      <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-orange-800 mb-2">🌏 Expansion mondiale</h4>
                          <ul className="text-orange-700 text-sm space-y-1">
                            <li>• Intégration native iOS 11 et Android</li>
                            <li>• Explosion en Chine avec WeChat Pay</li>
                            <li>• Adoption en Europe et Amérique</li>
                            <li>• 5+ milliards de smartphones compatibles</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {event.id === 'pandemic' && (
                      <div className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">🦠 Impact COVID-19</h4>
                          <ul className="text-red-700 text-sm space-y-1">
                            <li>• Menus de restaurant sans contact</li>
                            <li>• Traçage sanitaire (pass vaccinal)</li>
                            <li>• Boom des paiements mobiles</li>
                            <li>• +300% d'utilisation en 2 ans</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Impact de l'époque</h4>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      {event.id === 'invention' && (
                        <div className="text-center">
                          <div className="text-6xl mb-4">🏭</div>
                          <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                          <p className="text-gray-700">des pièces Toyota tracées</p>
                        </div>
                      )}
                      {event.id === 'automotive' && (
                        <div className="text-center">
                          <div className="text-6xl mb-4">📈</div>
                          <div className="text-3xl font-bold text-green-600 mb-2">-40%</div>
                          <p className="text-gray-700">d'erreurs de production</p>
                        </div>
                      )}
                      {event.id === 'mobile' && (
                        <div className="text-center">
                          <div className="text-6xl mb-4">📱</div>
                          <div className="text-3xl font-bold text-purple-600 mb-2">80%</div>
                          <p className="text-gray-700">des Japonais équipés</p>
                        </div>
                      )}
                      {event.id === 'global' && (
                        <div className="text-center">
                          <div className="text-6xl mb-4">🌍</div>
                          <div className="text-3xl font-bold text-orange-600 mb-2">5B+</div>
                          <p className="text-gray-700">smartphones compatibles</p>
                        </div>
                      )}
                      {event.id === 'pandemic' && (
                        <div className="text-center">
                          <div className="text-6xl mb-4">📈</div>
                          <div className="text-3xl font-bold text-red-600 mb-2">+300%</div>
                          <p className="text-gray-700">usage pendant COVID</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </section>

        {/* Decade Deep Dive */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            🔍 Analyse par décennie
          </h2>

          {/* Decade Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {decades.map((decade) => (
                <button
                  key={decade.id}
                  onClick={() => setSelectedDecade(decade.id)}
                  className={`px-6 py-3 rounded-md transition-colors font-medium ${
                    selectedDecade === decade.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {decade.title}
                </button>
              ))}
            </div>
          </div>

          {/* Decade Content */}
          {decades.map((decade) => (
            selectedDecade === decade.id && (
              <div key={decade.id} className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{decade.title}</h3>
                  <p className="text-xl text-gray-600">{decade.subtitle}</p>
                </div>

                <div className="space-y-6">
                  {decade.events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-6 bg-gray-50 p-6 rounded-lg">
                      <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg">
                        {event.year}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{event.event}</h4>
                        <p className="text-gray-600">{event.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </section>

        {/* The Inventors */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            👥 Les pionniers derrière l'invention
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {inventors.map((inventor, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">{inventor.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{inventor.name}</h3>
                  <p className="text-blue-600 font-medium mb-1">{inventor.role}</p>
                  <p className="text-gray-600 text-sm">{inventor.company}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Contribution</h4>
                  <p className="text-gray-600 text-sm">{inventor.contribution}</p>
                </div>

                <blockquote className="text-gray-700 italic text-sm bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                  "{inventor.quote}"
                </blockquote>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">🏢 Denso Wave : L'entreprise révolutionnaire</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">📋 Profil de l'entreprise</h4>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>• <strong>Fondation :</strong> 1949 (filiale de Toyota)</li>
                  <li>• <strong>Secteur :</strong> Équipements automobiles</li>
                  <li>• <strong>Siège :</strong> Kariya, préfecture d'Aichi</li>
                  <li>• <strong>Employés :</strong> 45,000+ dans le monde</li>
                  <li>• <strong>CA :</strong> 5,4 milliards USD (2023)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">🚀 Philosophy d'innovation</h4>
                <blockquote className="text-blue-700 italic text-sm mb-3">
                  "Nous créons des technologies qui changent la façon dont le monde fonctionne,
                  pas seulement des produits qui se vendent."
                </blockquote>
                <p className="text-blue-700 text-sm">
                  Denso Wave a rendu le QR Code gratuit et open-source dès le début,
                  privilégiant l'impact mondial à la rentabilité immédiate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Evolution */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            ⚙️ Évolution technique des QR codes
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">📐 Versions et capacités</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Version 1 (1994)</h4>
                  <div className="text-green-700 text-sm space-y-1">
                    <p>• Taille : 21×21 modules</p>
                    <p>• Capacité : 25 caractères alphanumériques</p>
                    <p>• Usage : Pièces automobiles simples</p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Version 10 (2000s)</h4>
                  <div className="text-blue-700 text-sm space-y-1">
                    <p>• Taille : 57×57 modules</p>
                    <p>• Capacité : 395 caractères alphanumériques</p>
                    <p>• Usage : URLs, coordonnées complètes</p>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Version 40 (actuel)</h4>
                  <div className="text-purple-700 text-sm space-y-1">
                    <p>• Taille : 177×177 modules</p>
                    <p>• Capacité : 7,089 caractères numériques</p>
                    <p>• Usage : Documents complexes, données JSON</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🔬 Innovations techniques</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">🎯 Motifs de positionnement</h4>
                  <p className="text-yellow-700 text-sm">
                    Les trois carrés caractéristiques permettent la détection automatique
                    même avec rotation ou déformation de 30°.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">🛡️ Correction d'erreur</h4>
                  <p className="text-red-700 text-sm">
                    Algorithme Reed-Solomon permettant la lecture même avec 30%
                    du code endommagé ou masqué.
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2">🎨 Masques d'optimisation</h4>
                  <p className="text-indigo-700 text-sm">
                    8 motifs de masque différents optimisent la lecture selon
                    le contenu et réduisent les erreurs de scan.
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h4 className="font-semibold text-teal-800 mb-2">📊 Modes de données</h4>
                  <p className="text-teal-700 text-sm">
                    4 modes d'encodage (numérique, alphanumérique, byte, kanji)
                    optimisent l'espace selon le type de contenu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔄 Évolutions récentes (2020-2024)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🤖 IA Integration</h4>
                <p className="text-gray-600 text-sm">
                  Reconnaissance contextuelle et génération automatique
                  de codes optimisés selon l'usage.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🔐 Sécurité renforcée</h4>
                <p className="text-gray-600 text-sm">
                  Chiffrement natif et signatures numériques pour
                  les applications sensibles.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🌈 Design avancé</h4>
                <p className="text-gray-600 text-sm">
                  Codes artistiques, logos intégrés et couleurs
                  multiples sans perte de fonctionnalité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Impact */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            🌍 Impact mondial et transformation digitale
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-green-800 mb-4">📱 Révolution des paiements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded">
                  <span className="text-green-700">Chine (Alipay/WeChat)</span>
                  <span className="font-bold text-green-600">80% des paiements</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded">
                  <span className="text-green-700">Inde (UPI/Paytm)</span>
                  <span className="font-bold text-green-600">65% des paiements</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded">
                  <span className="text-green-700">Afrique (Mobile Money)</span>
                  <span className="font-bold text-green-600">45% des paiements</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded">
                  <span className="text-green-700">Europe/USA</span>
                  <span className="font-bold text-green-600">25% des paiements</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">🏥 Applications critiques</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800">Santé</h4>
                  <p className="text-blue-700 text-sm">Dossiers médicaux, prescriptions, traçage COVID</p>
                </div>
                <div className="bg-white p-4 rounded border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800">Éducation</h4>
                  <p className="text-green-700 text-sm">Ressources pédagogiques, présence, évaluations</p>
                </div>
                <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                  <h4 className="font-medium text-purple-800">Transport</h4>
                  <p className="text-purple-700 text-sm">Billets électroniques, informations temps réel</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">💡 L'héritage de l'innovation japonaise</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-semibold text-purple-800 mb-2">Philosophie Kaizen</h4>
                <p className="text-purple-700 text-sm">
                  Amélioration continue : chaque version de QR code apporte des optimisations.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h4 className="font-semibold text-purple-800 mb-2">Open Source</h4>
                <p className="text-purple-700 text-sm">
                  Gratuit dès le début pour favoriser l'adoption mondiale plutôt que le profit.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h4 className="font-semibold text-purple-800 mb-2">Impact durable</h4>
                <p className="text-purple-700 text-sm">
                  30 ans après, les QR codes continuent d'évoluer et de s'adapter aux nouveaux besoins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Perspectives */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            🔮 L'avenir des QR codes (2025-2030)
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Technologies émergentes</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-indigo-800 mb-2">🥽 Réalité Augmentée</h4>
                  <p className="text-indigo-700 text-sm">
                    QR codes invisibles intégrés dans l'environnement, détectables uniquement
                    par AR pour des expériences immersives.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-teal-800 mb-2">🧠 IA Contextuelle</h4>
                  <p className="text-teal-700 text-sm">
                    Génération automatique de codes personnalisés selon le contexte,
                    l'utilisateur et l'environnement.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-pink-800 mb-2">🔗 Blockchain Integration</h4>
                  <p className="text-pink-700 text-sm">
                    QR codes liés à des smart contracts pour des transactions
                    automatisées et vérifiables.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-red-800 mb-2">🌐 IoT Integration</h4>
                  <p className="text-red-700 text-sm">
                    Codes dynamiques générés par objets connectés pour configuration
                    et contrôle automatisés.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">📊 Prédictions d'usage</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4">📈 Croissance attendue 2025-2030</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Paiements mobiles</span>
                    <div className="bg-gray-200 rounded-full w-32 h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Marketing interactif</span>
                    <div className="bg-gray-200 rounded-full w-32 h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Documents officiels</span>
                    <div className="bg-gray-200 rounded-full w-32 h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Domotique/IoT</span>
                    <div className="bg-gray-200 rounded-full w-32 h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded border">
                  <h5 className="font-medium text-gray-800 mb-2">🎯 Prévision 2030</h5>
                  <p className="text-gray-600 text-sm">
                    <strong>50+ milliards</strong> de scans QR par an dans le monde,
                    avec une intégration complète dans l'écosystème digital quotidien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legacy and Recognition */}
        <section className="bg-yellow-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🏆 Reconnaissance et récompenses</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-yellow-200 text-center">
              <div className="text-4xl mb-4">🥇</div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-800">Prix European Inventor (2014)</h3>
              <p className="text-yellow-700 text-sm">
                Masahiro Hara récompensé par l'Office européen des brevets
                pour l'impact de son invention.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-yellow-200 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-800">IEEE Milestone (2020)</h3>
              <p className="text-yellow-700 text-sm">
                Les QR codes reconnus comme jalons historiques de l'ingénierie
                électronique mondiale.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-yellow-200 text-center">
              <div className="text-4xl mb-4">🎌</div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-800">Patrimoine technologique</h3>
              <p className="text-yellow-700 text-sm">
                Intégration dans l'histoire de l'innovation japonaise
                au même niveau que le Walkman Sony.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <blockquote className="text-2xl text-gray-800 italic mb-4">
              "Une innovation née d'un besoin simple a transformé la façon
              dont l'humanité échange l'information."
            </blockquote>
            <cite className="text-gray-600">
              - Comité du Prix European Inventor 2014
            </cite>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl">
          <h2 className="text-3xl font-bold mb-4">🎨 Créez votre part d'histoire !</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            30 ans après leur invention, les QR codes continuent d'évoluer.
            Rejoignez les millions d'innovateurs qui utilisent cette technologie révolutionnaire !
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/designer"
                  className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg">
              🚀 Créer mon QR Code gratuit
            </Link>
            <Link href="/blog/qr-code-gratuit-benin"
                  className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              📚 Guide d'utilisation complet
            </Link>
          </div>

          <div className="mt-8 space-y-2 text-sm opacity-90">
            <p>⚡ Gratuit • 🔒 Sécurisé • 🎨 Personnalisable</p>
            <p>🌍 Utilisé par des milliards de personnes • 🇯🇵 Technologie éprouvée depuis 1994</p>
          </div>
        </section>

        {/* Related Articles */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">
            📚 Pour aller plus loin
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/qr-code-mobile-money"
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💳</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                QR codes Mobile Money
              </h3>
              <p className="text-gray-600 mb-4">
                Comment les QR codes révolutionnent les paiements mobiles en Afrique.
              </p>
              <div className="text-green-600 font-medium text-sm">
                Découvrir l'application →
              </div>
            </Link>

            <Link href="/blog/qr-code-securite"
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
                Sécurité des QR codes
              </h3>
              <p className="text-gray-600 mb-4">
                Bonnes pratiques et protection contre les risques de sécurité.
              </p>
              <div className="text-red-600 font-medium text-sm">
                Guide sécurité →
              </div>
            </Link>

            <Link href="/blog/qr-code-marketing"
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                Marketing avec QR codes
              </h3>
              <p className="text-gray-600 mb-4">
                Stratégies créatives pour vos campagnes marketing modernes.
              </p>
              <div className="text-blue-600 font-medium text-sm">
                Stratégies marketing →
              </div>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
              <span>🇯🇵 Inventé au Japon en 1994</span>
              <span>•</span>
              <span>🌍 Adopté mondialement</span>
              <span>•</span>
              <span>🆓 Gratuit et open-source</span>
            </div>
            <p className="text-xs text-gray-500">
              Sources : Denso Wave, IEEE, Office européen des brevets, données de marché 2024
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}