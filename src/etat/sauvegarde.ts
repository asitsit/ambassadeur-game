import { CLE_SAUVEGARDE } from "../constantes";
import type { Equipe, Partie } from "../types";

export function partieVide(): Partie {
  return {
    version: 1,
    mots: [],
    equipes: [],
    motsMasques: false,
    sonActif: true,
    ecran: "preparation",
  };
}

function estEquipe(valeur: unknown): valeur is Equipe {
  const e = valeur as Equipe;
  return (
    typeof e === "object" &&
    e !== null &&
    typeof e.id === "string" &&
    typeof e.nom === "string" &&
    typeof e.couleur === "string" &&
    (e.emoji === null || typeof e.emoji === "string") &&
    typeof e.indexMot === "number" &&
    (e.arriveeA === null || typeof e.arriveeA === "number")
  );
}

/** Relit la partie enregistrée. Si elle est absente ou illisible : partie vide. */
export function chargerPartie(): Partie {
  try {
    const texte = localStorage.getItem(CLE_SAUVEGARDE);
    if (!texte) return partieVide();
    const p = JSON.parse(texte) as Partie;
    if (
      p?.version !== 1 ||
      !Array.isArray(p.mots) ||
      !p.mots.every((m) => typeof m === "string") ||
      !Array.isArray(p.equipes) ||
      !p.equipes.every(estEquipe)
    ) {
      return partieVide();
    }
    const ecran = ["preparation", "partie", "classement"].includes(p.ecran) ? p.ecran : "preparation";
    return {
      version: 1,
      mots: p.mots,
      equipes: p.equipes,
      motsMasques: Boolean(p.motsMasques),
      sonActif: p.sonActif !== false,
      // Sans mots ni équipes, on ne peut pas être en pleine partie
      ecran: p.mots.length > 0 && p.equipes.length > 0 ? ecran : "preparation",
    };
  } catch {
    return partieVide();
  }
}

export function enregistrerPartie(partie: Partie): void {
  try {
    localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(partie));
  } catch {
    // Stockage plein ou interdit (navigation privée) : la partie continue sans sauvegarde
  }
}
