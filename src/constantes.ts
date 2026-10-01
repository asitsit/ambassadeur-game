export const CLE_SAUVEGARDE = "l-ambassadeur:partie";

export const MAX_EQUIPES = 20;

/** Durée pendant laquelle un deuxième appui sur « Réussi » est ignoré. */
export const DELAI_DOUBLE_APPUI = 600;
/** Durée d'affichage du message « … passent au mot 5. » avec « Annuler ». */
export const DUREE_MESSAGE_ANNULER = 5000;
/** Durée d'affichage du bandeau « mission accomplie ». */
export const DUREE_BANDEAU_ARRIVEE = 3000;
/** Durée pendant laquelle un mot caché reste visible après un toucher. */
export const DUREE_REVELATION_MOT = 3000;

export type CouleurEquipe = {
  nom: string;
  hex: string;
  /** Couleur du texte posé sur cette couleur (initiale dans la pastille). */
  texte: "blanc" | "encre";
};

/**
 * Les 20 couleurs d'équipe, dans l'ordre d'attribution (section 5.6).
 * Lagon passe en texte encre : contraste 4,95 contre 3,1 avec du blanc.
 */
export const COULEURS_EQUIPE: CouleurEquipe[] = [
  { nom: "Tomate", hex: "#E8483B", texte: "blanc" },
  { nom: "Lagon", hex: "#1E9BD7", texte: "encre" },
  { nom: "Soleil", hex: "#F5C518", texte: "encre" },
  { nom: "Pomme", hex: "#5BB33E", texte: "encre" },
  { nom: "Raisin", hex: "#7B4BC9", texte: "blanc" },
  { nom: "Mandarine", hex: "#F28A1E", texte: "encre" },
  { nom: "Menthe", hex: "#1FB59A", texte: "encre" },
  { nom: "Fuchsia", hex: "#D63E9B", texte: "blanc" },
  { nom: "Cacao", hex: "#8A5A3C", texte: "blanc" },
  { nom: "Myrtille", hex: "#3D5BD9", texte: "blanc" },
  { nom: "Citron vert", hex: "#A8D83A", texte: "encre" },
  { nom: "Rose bonbon", hex: "#F59AC0", texte: "encre" },
  { nom: "Ardoise", hex: "#5B6577", texte: "blanc" },
  { nom: "Ciel", hex: "#7CC6F2", texte: "encre" },
  { nom: "Framboise", hex: "#B8264F", texte: "blanc" },
  { nom: "Sapin", hex: "#1F7A4D", texte: "blanc" },
  { nom: "Abricot", hex: "#F7B27A", texte: "encre" },
  { nom: "Lavande", hex: "#B39DF0", texte: "encre" },
  { nom: "Pétrole", hex: "#0F6E7A", texte: "blanc" },
  { nom: "Nuit", hex: "#232A63", texte: "blanc" },
];

export const OR_DU_SCEAU = "#FFC53D";
const ENCRE = "#1C2147";

/** Couleur de texte lisible sur la couleur d'une équipe. */
export function couleurTexteSur(hex: string): string {
  const couleur = COULEURS_EQUIPE.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
  return couleur?.texte === "encre" ? ENCRE : "#FFFFFF";
}

export const EMOJIS = [
  "🦊", "🐻", "🐼", "🐸", "🦁", "🐯", "🐨", "🐙", "🦄", "🐝",
  "🐢", "🦉", "🐧", "🦖", "🐳", "🦜", "🐞", "🦋", "🍕", "🍉",
  "🌵", "🚀", "⚡", "🌈", "⭐", "🎈", "🎩", "👑", "🎲", "🎸",
];
