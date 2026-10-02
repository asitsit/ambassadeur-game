import type { Demander } from "./confirmation";

/** Avant de remettre toutes les équipes au premier mot (mots et équipes conservés). */
export function confirmerRecommencer(demander: Demander): Promise<boolean> {
  return demander(
    "Remettre toutes les équipes au premier mot ? Les mots et les équipes sont conservés.",
    { confirmer: "Recommencer", danger: true },
  );
}

/** Avant d'effacer les équipes et les mots pour repartir de zéro. */
export function confirmerNouvellePartie(demander: Demander): Promise<boolean> {
  return demander("Effacer les équipes et les mots pour préparer une nouvelle partie ?", {
    confirmer: "Tout effacer",
    danger: true,
  });
}
