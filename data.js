/*
  Tout le contenu du site Netra se remplit ici.
  Laisser une valeur vide ('' ou []) garde l'emplacement "à venir" sur la page.
*/
window.NETRA = {
  /* date et heure du vote, format ISO, par exemple '2027-02-12T18:00:00+01:00'.
     Une fois remplie, le compte à rebours démarre sur l'accueil et sur la page campagne. */
  voteDate: '',

  /* le compte Instagram de la liste, sans @, par exemple 'netra_tmsp' */
  instagram: '',

  /* les noms, rôle par rôle : une liste de prénoms et noms par case */
  equipe: {
    presidence: [],
    vpTsp: [],
    vpImtbs: [],
    secretariat: [],
    tresorerie: [],
    soirees: [],
    evenements: [],
    partenariats: [],
    communication: [],
    prevention: [],
    logistique: [],
    international: [],
    developpementDurable: [],
  },

  /* le programme, un objet par axe :
     { titre: 'Les soirées', phrase: 'Une phrase qui résume l’axe.', mesures: ['Première mesure', 'Deuxième mesure'] } */
  programme: [],

  /* les dates clés de la campagne, dans l'ordre :
     { date: '2027-02-03', titre: 'Ouverture de la campagne', texte: 'Au forum, toute la journée.' } */
  campagne: [],

  /* les clips : { titre: 'Clip de campagne', youtube: 'identifiant de la vidéo YouTube' } */
  clips: [],

  /* le petit-déj */
  petitdej: {
    /* passer à true et renseigner endpoint (l'adresse qui reçoit les commandes) pour ouvrir les commandes */
    ouvert: false,
    endpoint: '',
    /* les créneaux de livraison proposés : exemple à remplacer */
    creneaux: ['7 h 30 à 8 h', '8 h à 8 h 30', '8 h 30 à 9 h'],
    /* le menu : exemple à remplacer. prix en euros, ou null pour ne pas l'afficher */
    menu: [
      { id: 'croissant', nom: 'Croissant', detail: 'Pur beurre', prix: null },
      { id: 'painchoc', nom: 'Pain au chocolat', detail: 'Ou chocolatine', prix: null },
      { id: 'jus', nom: 'Jus d’orange', detail: '25 cl', prix: null },
      { id: 'cafe', nom: 'Café', detail: 'Chaud, dans un gobelet fermé', prix: null },
      { id: 'chocolat', nom: 'Chocolat chaud', detail: 'Pour ceux qui ne boivent pas de café', prix: null },
    ],
    /* quantité maximale par article */
    max: 6,
  },
};
