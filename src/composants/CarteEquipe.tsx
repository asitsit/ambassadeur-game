import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DELAI_DOUBLE_APPUI, DUREE_REVELATION_MOT, couleurTexteSur } from "../constantes";
import type { Equipe } from "../types";
import Icone from "./Icone";
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
    <article
      className="carte-equipe"
      style={{ "--equipe": equipe.couleur, "--sur-equipe": couleurTexteSur(equipe.couleur) } as CSSProperties}
    >
      <header className="carte-equipe-haut">
        <PastilleEquipe equipe={equipe} />
        <h2 className="nom-equipe">{equipe.nom}</h2>
        <span className="avancement" aria-label={`Mot ${equipe.indexMot + 1} sur ${mots.length}`}>
          {equipe.indexMot + 1}
          <span className="avancement-total">/{mots.length}</span>
        </span>
      </header>

      <div className="carte-equipe-corps">
        {cache ? (
          <button className="mot mot--cache" onClick={() => setRevele(true)}>
            Mot caché
            <span className="mot-indice">Toucher pour voir</span>
          </button>
        ) : (
          <p className="mot" aria-live="polite">
            {mot}
          </p>
        )}

        <Passeport equipe={equipe} nombreDeMots={mots.length} />

        <div className="actions-carte">
          <button
            className="bouton bouton--neutre bouton-retour"
            onClick={() => onRevenir(equipe)}
            disabled={equipe.indexMot === 0}
            aria-label={`Ramener ${equipe.nom} au mot précédent`}
            title="Revenir d'un mot"
          >
            <Icone nom="retour" taille={24} />
          </button>
          <button className="bouton bouton--succes bouton-reussi" onClick={reussi}>
            <Icone nom="valider" taille={24} />
            Réussi
          </button>
        </div>
      </div>
    </article>
  );
}
