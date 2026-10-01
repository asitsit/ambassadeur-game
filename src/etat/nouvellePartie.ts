import type { Demander } from "./confirmation";

/** Demande confirmation avant de remettre toutes les équipes au premier mot. */
export function confirmerNouvellePartie(demander: Demander): Promise<boolean> {
  return demander(
    "Remettre toutes les équipes au premier mot ? Les mots et les équipes sont conservés.",
    { confirmer: "Nouvelle partie", danger: true },
  );
}
