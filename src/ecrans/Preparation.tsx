import { useCallback, useState } from "react";
import ChoixCouleurEmoji from "../composants/ChoixCouleurEmoji";
import Entete from "../composants/Entete";
import PastilleEquipe from "../composants/PastilleEquipe";
import { MAX_EQUIPES } from "../constantes";
import { useConfirmation } from "../etat/confirmation";
import {
  lireMots,
  melanger,
  memesMots,
  partieCommencee,
  peutAjouterEquipe,
  verifierPartie,
} from "../etat/regles";
import type { ActionsPartie } from "../etat/usePartie";
import type { Equipe, Partie } from "../types";

type Props = { partie: Partie; actions: ActionsPartie };

export default function Preparation({ partie, actions }: Props) {
  const demander = useConfirmation();
  const [texteMots, setTexteMots] = useState(() => partie.mots.join("\n"));
  const [erreur, setErreur] = useState<string | null>(null);
  const [idEnChoix, setIdEnChoix] = useState<string | null>(null);
  const fermerChoix = useCallback(() => setIdEnChoix(null), []);
  const equipeEnChoix = partie.equipes.find((e) => e.id === idEnChoix);

  const commencee = partieCommencee(partie.equipes);
  const mots = lireMots(texteMots);

  // Avant le début de la partie, les mots sont enregistrés au fil de la frappe.
  // Une fois la partie commencée, ils ne sont appliqués qu'au lancement, après confirmation.
  function changerMots(texte: string) {
    setTexteMots(texte);
    setErreur(null);
    if (!commencee) actions.definirMots(lireMots(texte));
  }

  function melangerMots() {
    changerMots(melanger(mots).join("\n"));
  }

  async function supprimer(equipe: Equipe) {
    if (commencee) {
      const ok = await demander(`Supprimer l'équipe « ${equipe.nom.trim() || "sans nom"} » ?`, {
        confirmer: "Supprimer",
        danger: true,
      });
      if (!ok) return;
    }
    setErreur(null);
    actions.supprimerEquipe(equipe.id);
  }

  async function lancer() {
    const probleme = verifierPartie(mots, partie.equipes);
    setErreur(probleme);
    if (probleme) return;
    if (commencee && !memesMots(mots, partie.mots)) {
      const ok = await demander(
        "La liste de mots a changé. Toutes les équipes vont repartir du premier mot. Continuer ?",
      );
      if (!ok) return;
    }
    actions.definirMots(mots);
    actions.allerA("partie");
  }

  return (
    <div className="ecran">
      <Entete sousTitre={commencee ? "Modifier la partie" : "Préparation"} />

      <main className="contenu preparation">
        <section className="carte bloc">
          <h1>Les mots</h1>
          <label htmlFor="mots" className="aide">
            Un mot ou une expression par ligne, dans l'ordre du jeu.
          </label>
          <textarea
            id="mots"
            className="zone-mots"
            value={texteMots}
            onChange={(e) => changerMots(e.target.value)}
            placeholder={"Girafe\nBrosse à dents\nTour Eiffel"}
            rows={8}
            spellCheck={false}
          />
          <div className="ligne-entre">
            <span className="compteur">
              {mots.length} {mots.length > 1 ? "mots" : "mot"}
            </span>
            <button
              className="bouton bouton--secondaire bouton--petit"
              onClick={melangerMots}
              disabled={mots.length < 2}
            >
              🔀 Mélanger l'ordre
            </button>
          </div>
        </section>

        <section className="carte bloc">
          <h1>Les équipes</h1>
          {partie.equipes.length === 0 ? (
            <p className="vide">Aucune équipe pour l'instant. Ajoutez la première délégation !</p>
          ) : (
            <ul className="liste-equipes">
              {partie.equipes.map((equipe) => (
                <li key={equipe.id} className="ligne-equipe">
                  <button
                    className="bouton-pastille"
                    onClick={() => setIdEnChoix(equipe.id)}
                    aria-label={`Couleur et emoji de ${equipe.nom}`}
                  >
                    <PastilleEquipe equipe={equipe} />
                  </button>
                  <input
                    className="champ"
                    value={equipe.nom}
                    onChange={(e) => {
                      setErreur(null);
                      actions.modifierEquipe(equipe.id, { nom: e.target.value });
                    }}
                    aria-label="Nom de l'équipe"
                    maxLength={30}
                  />
                  <button
                    className="bouton-icone bouton-icone--danger"
                    onClick={() => supprimer(equipe)}
                    aria-label={`Supprimer ${equipe.nom}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            className="bouton bouton--secondaire bouton--large"
            onClick={() => {
              setErreur(null);
              actions.ajouterEquipe();
            }}
            disabled={!peutAjouterEquipe(partie.equipes)}
          >
            + Ajouter une équipe
          </button>
          {!peutAjouterEquipe(partie.equipes) && (
            <p className="aide centre">{MAX_EQUIPES} équipes au maximum</p>
          )}
        </section>
      </main>

      <footer className="barre-bas">
        {erreur && (
          <p className="erreur" role="alert">
            {erreur}
          </p>
        )}
        <button className="bouton bouton--large" onClick={lancer}>
          {commencee ? "Reprendre la partie" : "Lancer la partie"}
        </button>
      </footer>

      {equipeEnChoix && (
        <ChoixCouleurEmoji
          equipe={equipeEnChoix}
          equipes={partie.equipes}
          onModifier={(modification) => actions.modifierEquipe(equipeEnChoix.id, modification)}
          onFermer={fermerChoix}
        />
      )}
    </div>
  );
}
