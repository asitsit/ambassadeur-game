import { useEffect } from "react";
import { DUREE_MESSAGE_ANNULER } from "../constantes";

type Props = {
  texte: string;
  onAnnuler: () => void;
  /** Appelé quand le message disparaît tout seul. */
  onFin: () => void;
};

/** Message en bas de l'écran (« Les Renards 🦊 passent au mot 5. ») avec un bouton « Annuler ». */
export default function MessageAnnuler({ texte, onAnnuler, onFin }: Props) {
  useEffect(() => {
    const minuteur = setTimeout(onFin, DUREE_MESSAGE_ANNULER);
    return () => clearTimeout(minuteur);
  }, [onFin]);

  return (
    <div className="message-annuler" role="status">
      <span className="message-annuler-texte">{texte}</span>
      <button className="message-annuler-bouton" onClick={onAnnuler}>
        Annuler
      </button>
    </div>
  );
}
