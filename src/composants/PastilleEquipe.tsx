import { couleurTexteSur } from "../constantes";
import { initiale } from "../etat/regles";
import type { Equipe } from "../types";

type Props = {
  equipe: Pick<Equipe, "nom" | "couleur" | "emoji">;
  /** Diamètre en pixels (40 par défaut). */
  taille?: number;
};

/** Cercle de la couleur de l'équipe, avec son emoji ou l'initiale de son nom. */
export default function PastilleEquipe({ equipe, taille = 40 }: Props) {
  return (
    <span
      className="pastille"
      aria-hidden="true"
      style={{
        width: taille,
        height: taille,
        background: equipe.couleur,
        color: couleurTexteSur(equipe.couleur),
        fontSize: Math.round(taille * (equipe.emoji ? 0.55 : 0.48)),
      }}
    >
      {equipe.emoji ?? initiale(equipe.nom)}
    </span>
  );
}
