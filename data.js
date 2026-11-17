window.NETRA_DATA = {
  // Date et heure exacte du début des petits-déjeuners (format ISO)
  // Le module Petit-Déj s'affichera automatiquement 48h avant cette date !
  petitDejDate: "2027-01-20T07:30:00+01:00",
  
  // Pour tester l'affichage immédiatement pendant que tu codes, passe forceAffichagePetitDej à true :
  forceAffichagePetitDej: false,

  // URL de ton serveur Python FastAPI
  apiEndpoint: "http://localhost:8000/api/commandes",

  // Organigramme complet (19 pôles issus de ton visuel)
  organigramme: [
    { pole: "Présidence", bureau: true, membres: ["Augustin Ehret"] },
    { pole: "VP IMT-BS", bureau: true, membres: ["Cléa Rolinet"] },
    { pole: "VP TSP", bureau: true, membres: ["Romain Guerra"] },
    { pole: "VP FISA", bureau: true, membres: ["Marion Barbé"] },
    { pole: "VP Bachelor", bureau: true, membres: ["Odyn Faivre"] },
    { pole: "Trésorerie", bureau: true, membres: ["Rose Gayno-Amédro", "Matthieu Hebert"] },
    { pole: "Secrétaire", bureau: true, membres: ["Raphaël Bodin"] },
    { pole: "Relations Entreprises (RE)", bureau: false, membres: ["Rawane Bouhsina", "Walid Mehrez", "Maram Chaabani"] },
    { pole: "Soirée", bureau: false, membres: ["Benjamin Vesval", "Camilla Clément", "Tristan Jallade", "Paul Bertrand"] },
    { pole: "Prévention", bureau: false, membres: ["Martin Daems", "Lucas Vandoni"] },
    { pole: "Séculogie", bureau: false, membres: ["Étienne Barth"] },
    { pole: "Numérique", bureau: false, membres: ["Yugo Lebrun", "Tristan Cottin"] },
    { pole: "Ritz", bureau: false, membres: ["Paloma Meyer", "Charlotte Vercollier"] },
    { pole: "Event", bureau: false, membres: ["Tom Braudel", "Chloé Zheng", "Siman Benasseur", "Lina Masmoudi"] },
    { pole: "Alumni", bureau: false, membres: ["Arthur Schmitt"] },
    { pole: "Relations Internationales (RI)", bureau: false, membres: ["Ugo Ifrah"] },
    { pole: "Pougnes TSP / IMT-BS", bureau: false, membres: ["Augustin Barré", "Sarra Salah Belhaj"] },
    { pole: "Développement Durable (DD)", bureau: false, membres: ["Mika Teixeira"] },
    { pole: "Communication", bureau: false, membres: ["Léna Poussin", "Lise Huang", "Mattéo Rousset", "Vadim Prodkurnyak", "Samy Bouanane"] }
  ],

  // Programme de campagne
  programme: [
    {
      axe: "01. Vie de Campus & Soirées",
      description: "Des événements fédérateurs pour rassembler TSP et IMT-BS toute l'année.",
      mesures: [
        "Création d'un pass soirée annuel à tarif réduit pour les cotisants",
        "Navettes sécurisées systématiques pour les soirées extérieures",
        "Animations hebdomadaires au foyer avec tournois inter-promos"
      ]
    },
    {
      axe: "02. Intégration & Cohésion",
      description: "Accompagner chaque 1A, FISA, Bachelor et international dès son arrivée à Évry.",
      mesures: [
        "Système de parrainage inter-écoles renforcé dès la rentrée",
        "Week-End d'Intégration (WEI) inoubliable avec shotgun transparent",
        "Guide pratique numérique du campus et de la vie à Évry"
      ]
    },
    {
      axe: "03. Partenariats & Bons Plans",
      description: "Augmenter le pouvoir d'achat étudiant grâce au réseau entreprises.",
      mesures: [
        "Réductions négociées chez les commerçants et restaurants d'Évry",
        "Distribution régulière de goodies et paniers repas",
        "Forums et afterworks avec nos partenaires"
      ]
    }
  ],

  // Timeline de campagne
  timeline: [
    { date: "12 Janvier", titre: "Dévoilement officiel du site", desc: "Lancement de la campagne Netra sur le campus." },
    { date: "Semaine de campagne", titre: "Les Petits-Déjeuners", desc: "Livraison directe dans ta chambre à Évry pour 1 € (ouverture des commandes 48h avant)." },
    { date: "Jour du Vote", titre: "Élections BDE", desc: "Mobilisation générale pour élire la liste Netra." }
  ],

  // Clips YouTube (remplace l'ID par l'identifiant de tes vidéos YouTube)
  clips: [
    { titre: "Teaser Netra 2027", youtubeId: "" },
    { titre: "Clip de Campagne Officiel", youtubeId: "" }
  ],

  // Menu Petit-Déjeuner (1 € symbolique pour les cotisants)
  menuPetitDej: [
    { id: "formule_sucree", nom: "Menu Sucré (1 €)", detail: "1 Viennoiserie + 1 Jus d'orange + 1 Boisson chaude" },
    { id: "formule_salee", nom: "Menu Salé Brunch (1 €)", detail: "Œufs brouillés / Bacon ou Végé + Jus + Boisson chaude" }
  ]
};
