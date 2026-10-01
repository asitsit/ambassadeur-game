/*
  Règles du jeu sous forme de petites fonctions sans effet de bord :
  elles calculent quelque chose à partir de la partie, sans la modifier.
*/
import { COULEURS_EQUIPE, EMOJIS, MAX_EQUIPES } from "../constantes";
import type { Equipe } from "../types";

/** Une ligne = un mot. Lignes vides et espaces autour ignorés. */
export function lireMots(texte: string): string[] {
  return texte
    .split("\n")
    .map((ligne) => ligne.trim())
    .filter((ligne) => ligne !== "");
}

export function memesMots(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((mot, i) => mot === b[i]);
}

export function melanger<T>(liste: T[]): T[] {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/** Message d'erreur à afficher avant de lancer la partie, ou null si tout va bien. */
export function verifierPartie(mots: string[], equipes: Equipe[]): string | null {
  if (mots.length === 0) return "Ajoutez au moins un mot pour commencer.";
  if (equipes.length === 0) return "Ajoutez au moins une équipe.";
  if (equipes.some((e) => e.nom.trim() === "")) return "Donnez un nom à chaque équipe.";
  const vus = new Map<string, string>();
  for (const e of equipes) {
    const cle = e.nom.trim().toLocaleLowerCase("fr");
    if (vus.has(cle)) {
      return `Deux équipes s'appellent "${e.nom.trim()}". Changez l'un des noms.`;
    }
    vus.set(cle, e.nom);
  }
  return null;
}

/** La partie a commencé dès qu'une équipe a avancé d'au moins un mot. */
export function partieCommencee(equipes: Equipe[]): boolean {
  return equipes.some((e) => e.indexMot > 0 || e.arriveeA !== null);
}

/** Équipes encore en jeu, dans leur ordre d'origine (qui ne change jamais). */
export function equipesEnJeu(equipes: Equipe[]): Equipe[] {
  return equipes.filter((e) => e.arriveeA === null);
}

/** Équipes arrivées, dans l'ordre d'arrivée. */
export function equipesArrivees(equipes: Equipe[]): Equipe[] {
  return equipes
    .filter((e) => e.arriveeA !== null)
    .sort((a, b) => (a.arriveeA ?? 0) - (b.arriveeA ?? 0));
}

/** « 1re place », « 2e place »… */
export function libelleRang(rang: number): string {
  return rang === 1 ? "1re" : `${rang}e`;
}

export function medaille(rang: number): string | null {
  return ["🥇", "🥈", "🥉"][rang - 1] ?? null;
}

export function peutAjouterEquipe(equipes: Equipe[]): boolean {
  return equipes.length < MAX_EQUIPES;
}

export function premiereCouleurLibre(equipes: Equipe[]): string {
  const prises = new Set(equipes.map((e) => e.couleur.toLowerCase()));
  return (COULEURS_EQUIPE.find((c) => !prises.has(c.hex.toLowerCase())) ?? COULEURS_EQUIPE[0]).hex;
}

export function premierEmojiLibre(equipes: Equipe[]): string | null {
  const pris = new Set(equipes.map((e) => e.emoji));
  return EMOJIS.find((emoji) => !pris.has(emoji)) ?? null;
}

/** « Équipe 4 », en évitant un nom déjà utilisé. */
export function nomParDefaut(equipes: Equipe[]): string {
  const noms = new Set(equipes.map((e) => e.nom.trim().toLocaleLowerCase("fr")));
  let numero = equipes.length + 1;
  while (noms.has(`équipe ${numero}`)) numero++;
  return `Équipe ${numero}`;
}

export function initiale(nom: string): string {
  return nom.trim().charAt(0).toLocaleUpperCase("fr") || "?";
}

export function nouvelId(): string {
  // crypto.randomUUID n'existe que sur https ou localhost : prévoir un repli
  // pour les tests sur téléphone via l'adresse « Network » en http.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
