import { useEffect } from "react";
import { DUREE_BANDEAU_ARRIVEE } from "../constantes";
import { libelleRang } from "../etat/regles";
import type { Equipe } from "../types";
import PastilleEquipe from "./PastilleEquipe";

type Props = {
  equipe: Equipe;
  rang: number;
  onFin: () => void;
};

/** Grand bandeau « 🦊 Les Renards : mission accomplie ! 1re place », 3 secondes. */
export default function BandeauArrivee({ equipe, rang, onFin }: Props) {
  useEffect(() => {
    const minuteur = setTimeout(onFin, DUREE_BANDEAU_ARRIVEE);
    return () => clearTimeout(minuteur);
  }, [onFin]);

  return (
    <div className="bandeau-arrivee" role="status" onClick={onFin}>
      <div className="bandeau-arrivee-carte" style={{ borderColor: equipe.couleur }}>
        <PastilleEquipe equipe={equipe} taille={72} />
        <p className="bandeau-arrivee-titre">
          {equipe.emoji ? `${equipe.emoji} ` : ""}
          {equipe.nom} : mission accomplie !
        </p>
        <p className="bandeau-arrivee-rang">{libelleRang(rang)} place</p>
      </div>
    </div>
  );
}
