import { useCallback, useState } from "react";
import CarteEquipe from "../composants/CarteEquipe";
import Entete from "../composants/Entete";
import MessageAnnuler from "../composants/MessageAnnuler";
import { useConfirmation } from "../etat/confirmation";
import { equipesArrivees, equipesEnJeu } from "../etat/regles";
import type { ActionsPartie } from "../etat/usePartie";
import type { Equipe, Partie as TypePartie } from "../types";

type Props = { partie: TypePartie; actions: ActionsPartie };

type Message = { cle: number; texte: string; equipeId: string };

/** « Les Renards 🦊 » */
function nomAvecEmoji(equipe: Equipe): string {
  return equipe.emoji ? `${equipe.nom} ${equipe.emoji}` : equipe.nom;
}

export default function Partie({ partie, actions }: Props) {
  const demander = useConfirmation();
  const [message, setMessage] = useState<Message | null>(null);
  const fermerMessage = useCallback(() => setMessage(null), []);

  const enJeu = equipesEnJeu(partie.equipes);
  const arrivees = equipesArrivees(partie.equipes);

  function reussi(equipe: Equipe) {
    const prochainMot = equipe.indexMot + 1;
    actions.valider(equipe.id);
    setMessage({
      cle: Date.now(),
      equipeId: equipe.id,
      texte: `${nomAvecEmoji(equipe)} passent au mot ${prochainMot + 1}.`,
    });
  }

  function annulerMessage() {
    if (message) actions.annuler(message.equipeId);
    setMessage(null);
  }

  async function revenir(equipe: Equipe) {
    const ok = await demander(`Ramener ${equipe.nom} au mot ${equipe.indexMot} ?`, {
      confirmer: "Ramener",
    });
    if (ok) actions.annuler(equipe.id);
  }

  return (
    <div className="ecran ecran-partie">
      <Entete
        sousTitre={`${enJeu.length} ${enJeu.length > 1 ? "équipes" : "équipe"} en jeu, ${arrivees.length} ${arrivees.length > 1 ? "arrivées" : "arrivée"}`}
      >
        <button
          className="bouton-icone"
          onClick={actions.basculerMotsMasques}
          aria-pressed={partie.motsMasques}
          aria-label={partie.motsMasques ? "Afficher les mots" : "Masquer les mots"}
        >
          {partie.motsMasques ? "🙈" : "👁️"}
        </button>
        <button className="bouton-icone" onClick={() => actions.allerA("preparation")} aria-label="Modifier la partie">
          ⋯
        </button>
      </Entete>

      <main className="contenu contenu--large">
        <div className="grille-equipes">
          {enJeu.map((equipe) => (
            <CarteEquipe
              key={equipe.id}
              equipe={equipe}
              mots={partie.mots}
              motsMasques={partie.motsMasques}
              onReussi={reussi}
              onRevenir={revenir}
            />
          ))}
        </div>
      </main>

      {message && (
        <MessageAnnuler key={message.cle} texte={message.texte} onAnnuler={annulerMessage} onFin={fermerMessage} />
      )}
    </div>
  );
}
