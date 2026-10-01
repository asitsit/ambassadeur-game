import { useEffect, useRef, useState } from "react";
import { DELAI_DOUBLE_APPUI, DUREE_REVELATION_MOT } from "../constantes";
import type { Equipe } from "../types";
import Passeport from "./Passeport";
import PastilleEquipe from "./PastilleEquipe";

type Props = {
  equipe: Equipe;
  mots: string[];
  motsMasques: boolean;
  onReussi: (equipe: Equipe) => void;
  onRevenir: (equipe: Equipe) => void;
};

export default function CarteEquipe({ equipe, mots, motsMasques, onReussi, onRevenir }: Props) {
  const dernierAppui = useRef(0);
  const [revele, setRevele] = useState(false);

  // Un mot caché touché reste visible 3 secondes
  useEffect(() => {
    if (!revele) return;
    const minuteur = setTimeout(() => setRevele(false), DUREE_REVELATION_MOT);
    return () => clearTimeout(minuteur);
  }, [revele]);

  function reussi() {
    // Protection contre le double appui
    const maintenant = Date.now();
    if (maintenant - dernierAppui.current < DELAI_DOUBLE_APPUI) return;
    dernierAppui.current = maintenant;
    setRevele(false);
    onReussi(equipe);
  }

  const mot = mots[equipe.indexMot] ?? "";
  const cache = motsMasques && !revele;

  return (
    <article className="carte carte-equipe" style={{ borderLeftColor: equipe.couleur }}>
      <div className="carte-equipe-haut">
        <PastilleEquipe equipe={equipe} />
        <div className="carte-equipe-identite">
          <h2 className="nom-equipe">{equipe.nom}</h2>
          <p className="etape">
            Mot {equipe.indexMot + 1} sur {mots.length}
          </p>
        </div>
        <button
          className="bouton-icone bouton-revenir"
          onClick={() => onRevenir(equipe)}
          disabled={equipe.indexMot === 0}
          aria-label={`Ramener ${equipe.nom} au mot précédent`}
          title="Revenir d'un mot"
        >
          ↩︎
        </button>
      </div>

      {cache ? (
        <button className="mot mot--cache" onClick={() => setRevele(true)}>
          Mot caché
        </button>
      ) : (
        <p className="mot" aria-live="polite">
          {mot}
        </p>
      )}

      <Passeport equipe={equipe} nombreDeMots={mots.length} />

      <button className="bouton bouton--succes bouton--large bouton-reussi" onClick={reussi}>
        Réussi
      </button>
    </article>
  );
}
