import { useEffect, type CSSProperties } from "react";
import { DUREE_BANDEAU_ARRIVEE, couleurTexteSur } from "../constantes";
import { libelleRang, medaille } from "../etat/regles";
import type { Equipe } from "../types";
import Icone from "./Icone";
import PastilleEquipe from "./PastilleEquipe";

type Props = {
  equipe: Equipe;
  rang: number;
  onFin: () => void;
};

/**
 * Bandeau « 🦊 Les Renards : mission accomplie ! 1re place », 2 secondes.
 * Il ne bloque pas le reste de l'écran, et la croix le ferme tout de suite.
 */
export default function BandeauArrivee({ equipe, rang, onFin }: Props) {
  useEffect(() => {
    const minuteur = setTimeout(onFin, DUREE_BANDEAU_ARRIVEE);
    return () => clearTimeout(minuteur);
  }, [onFin]);

  return (
    <div className="bandeau-arrivee" role="status">
      <div
        className="bandeau-arrivee-carte"
        style={{ "--equipe": equipe.couleur, "--sur-equipe": couleurTexteSur(equipe.couleur) } as CSSProperties}
      >
        <button className="bandeau-arrivee-fermer" onClick={onFin} aria-label="Fermer">
          <Icone nom="fermer" taille={18} />
        </button>
        <span className="bandeau-arrivee-rayons" aria-hidden="true" />
        <PastilleEquipe equipe={equipe} taille={64} />
        <div className="bandeau-arrivee-texte">
          <p className="bandeau-arrivee-titre">Mission accomplie !</p>
          <p className="bandeau-arrivee-nom">
            {equipe.emoji ? `${equipe.emoji} ` : ""}
            {equipe.nom}
          </p>
          <p className="bandeau-arrivee-rang">
            {medaille(rang) ?? "🎉"} {libelleRang(rang)} place
          </p>
        </div>
      </div>
    </div>
  );
}
