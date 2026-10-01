export type Equipe = {
  id: string; // identifiant unique, par exemple crypto.randomUUID()
  nom: string;
  couleur: string; // hex, une des 20 couleurs, unique par équipe
  emoji: string | null; // null = afficher l'initiale du nom
  indexMot: number; // 0 = premier mot ; égal au nombre de mots = terminé
  arriveeA: number | null; // horodatage de l'arrivée, sert au classement
};

export type Ecran = "preparation" | "partie" | "classement";

export type Partie = {
  version: 1; // pour gérer les évolutions futures du format
  mots: string[];
  equipes: Equipe[];
  motsMasques: boolean;
  sonActif: boolean;
  ecran: Ecran;
};
