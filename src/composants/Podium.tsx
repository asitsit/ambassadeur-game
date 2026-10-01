import { medaille } from "../etat/regles";
import type { Equipe } from "../types";
import PastilleEquipe from "./PastilleEquipe";

type Props = {
  /** Équipes arrivées, dans l'ordre d'arrivée (seules les 3 premières sont utilisées). */
  arrivees: Equipe[];
};

const HAUTEURS = [128, 92, 68];

/** Podium : 2e à gauche, 1re au centre, 3e à droite. */
export default function Podium({ arrivees }: Props) {
  const places = [1, 0, 2]
    .map((i) => ({ equipe: arrivees[i], rang: i + 1 }))
    .filter((p): p is { equipe: Equipe; rang: number } => p.equipe !== undefined);

  return (
    <div className="podium" role="list" aria-label="Podium">
      {places.map(({ equipe, rang }) => (
        <div key={equipe.id} className="podium-place" role="listitem">
          <PastilleEquipe equipe={equipe} taille={rang === 1 ? 64 : 52} />
          <p className="podium-nom">{equipe.nom}</p>
          <div className="podium-marche" style={{ height: HAUTEURS[rang - 1], background: equipe.couleur }}>
            <span className="podium-medaille" aria-hidden="true">
              {medaille(rang)}
            </span>
            <span className="podium-rang">{rang}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
