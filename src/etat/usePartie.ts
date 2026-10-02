/*
  État de la partie et toutes les actions qui le modifient.
  Chaque modification est enregistrée dans le navigateur (localStorage).
*/
import { useEffect, useMemo, useState } from "react";
import type { Ecran, Equipe, Partie } from "../types";
import { chargerPartie, enregistrerPartie } from "./sauvegarde";
import {
  memesMots,
  nomParDefaut,
  nouvelId,
  peutAjouterEquipe,
  premierEmojiLibre,
  premiereCouleurLibre,
} from "./regles";

export type ModificationEquipe = Partial<Pick<Equipe, "nom" | "couleur" | "emoji">>;

export type ActionsPartie = {
  ajouterEquipe: () => void;
  modifierEquipe: (id: string, modification: ModificationEquipe) => void;
  supprimerEquipe: (id: string) => void;
  /** Remplace la liste de mots. Si elle change, toutes les équipes repartent du premier mot. */
  definirMots: (mots: string[]) => void;
  /** L'équipe passe au mot suivant ; après le dernier mot, elle est arrivée. */
  valider: (id: string) => void;
  /** Ramène l'équipe au mot précédent (ou annule son arrivée). */
  annuler: (id: string) => void;
  /** Remet toutes les équipes au premier mot. Mots et équipes sont conservés. */
  recommencerPartie: () => void;
  /** Efface les équipes et les mots, et revient à l'écran de préparation. */
  nouvellePartie: () => void;
  basculerMotsMasques: () => void;
  basculerSon: () => void;
  allerA: (ecran: Ecran) => void;
};

function avecEquipe(partie: Partie, id: string, changer: (e: Equipe) => Equipe): Partie {
  return { ...partie, equipes: partie.equipes.map((e) => (e.id === id ? changer(e) : e)) };
}

function remettreAuDebut(equipes: Equipe[]): Equipe[] {
  return equipes.map((e) => ({ ...e, indexMot: 0, arriveeA: null }));
}

export function usePartie(): [Partie, ActionsPartie] {
  const [partie, setPartie] = useState<Partie>(chargerPartie);

  useEffect(() => {
    enregistrerPartie(partie);
  }, [partie]);

  const actions = useMemo<ActionsPartie>(
    () => ({
      ajouterEquipe: () =>
        setPartie((p) => {
          if (!peutAjouterEquipe(p.equipes)) return p;
          const equipe: Equipe = {
            id: nouvelId(),
            nom: nomParDefaut(p.equipes),
            couleur: premiereCouleurLibre(p.equipes),
            emoji: premierEmojiLibre(p.equipes),
            indexMot: 0,
            arriveeA: null,
          };
          return { ...p, equipes: [...p.equipes, equipe] };
        }),

      modifierEquipe: (id, modification) =>
        setPartie((p) => {
          // Une couleur ne peut appartenir qu'à une seule équipe
          if (
            modification.couleur &&
            p.equipes.some(
              (e) => e.id !== id && e.couleur.toLowerCase() === modification.couleur!.toLowerCase(),
            )
          ) {
            return p;
          }
          return avecEquipe(p, id, (e) => ({ ...e, ...modification }));
        }),

      supprimerEquipe: (id) =>
        setPartie((p) => ({ ...p, equipes: p.equipes.filter((e) => e.id !== id) })),

      definirMots: (mots) =>
        setPartie((p) =>
          memesMots(p.mots, mots) ? p : { ...p, mots, equipes: remettreAuDebut(p.equipes) },
        ),

      valider: (id) =>
        setPartie((p) =>
          avecEquipe(p, id, (e) => {
            if (e.arriveeA !== null || e.indexMot >= p.mots.length) return e;
            const indexMot = e.indexMot + 1;
            return { ...e, indexMot, arriveeA: indexMot >= p.mots.length ? Date.now() : null };
          }),
        ),

      annuler: (id) =>
        setPartie((p) =>
          avecEquipe(p, id, (e) => {
            if (e.arriveeA !== null) {
              // L'équipe revient au dernier mot, le classement se recalcule tout seul
              return { ...e, arriveeA: null, indexMot: Math.max(0, p.mots.length - 1) };
            }
            return { ...e, indexMot: Math.max(0, e.indexMot - 1) };
          }),
        ),

      recommencerPartie: () => setPartie((p) => ({ ...p, equipes: remettreAuDebut(p.equipes) })),

      // Les réglages (son, mots masqués) sont conservés
      nouvellePartie: () => setPartie((p) => ({ ...p, mots: [], equipes: [], ecran: "preparation" })),

      basculerMotsMasques: () => setPartie((p) => ({ ...p, motsMasques: !p.motsMasques })),

      basculerSon: () => setPartie((p) => ({ ...p, sonActif: !p.sonActif })),

      allerA: (ecran) => setPartie((p) => ({ ...p, ecran })),
    }),
    [],
  );

  return [partie, actions];
}
