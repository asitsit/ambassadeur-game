import { useCallback, useEffect, useRef, useState } from "react";
import { celebrer } from "../celebration/celebrer";
import BandeauArrivee from "../composants/BandeauArrivee";
import CarteEquipe from "../composants/CarteEquipe";
import Entete from "../composants/Entete";
import Icone from "../composants/Icone";
import Menu from "../composants/Menu";
import MessageAnnuler from "../composants/MessageAnnuler";
import PastilleEquipe from "../composants/PastilleEquipe";
import { DUREE_BANDEAU_ARRIVEE } from "../constantes";
import { useConfirmation } from "../etat/confirmation";
import { confirmerNouvellePartie } from "../etat/nouvellePartie";
import { useEcranAllume } from "../etat/useEcranAllume";
import { equipesArrivees, equipesEnJeu, medaille } from "../etat/regles";
import type { ActionsPartie } from "../etat/usePartie";
import type { Equipe, Partie as TypePartie } from "../types";

type Props = { partie: TypePartie; actions: ActionsPartie };

type Message = { cle: number; texte: string; equipeId: string };
type Arrivee = { cle: number; equipe: Equipe; rang: number };

/** « Les Renards 🦊 » */
function nomAvecEmoji(equipe: Equipe): string {
  return equipe.emoji ? `${equipe.nom} ${equipe.emoji}` : equipe.nom;
}

function pluriel(nombre: number, singulier: string, pluriel: string): string {
  return `${nombre} ${nombre > 1 ? pluriel : singulier}`;
}

export default function Partie({ partie, actions }: Props) {
  const demander = useConfirmation();
  useEcranAllume();
  const [message, setMessage] = useState<Message | null>(null);
  const [arrivee, setArrivee] = useState<Arrivee | null>(null);
  const fermerMessage = useCallback(() => setMessage(null), []);
  const fermerBandeau = useCallback(() => setArrivee(null), []);

  const enJeu = equipesEnJeu(partie.equipes);
  const arrivees = equipesArrivees(partie.equipes);
  const tousArrives = partie.equipes.length > 0 && enJeu.length === 0;

  // Quand la dernière équipe arrive, le classement s'ouvre après le bandeau.
  // Seulement au moment de l'arrivée : pas en revenant du classement.
  const etaitTousArrives = useRef(tousArrives);
  useEffect(() => {
    const vientDeFinir = tousArrives && !etaitTousArrives.current;
    etaitTousArrives.current = tousArrives;
    if (!vientDeFinir) return;
    const minuteur = setTimeout(() => actions.allerA("classement"), DUREE_BANDEAU_ARRIVEE);
    return () => clearTimeout(minuteur);
  }, [tousArrives, actions]);

  function reussi(equipe: Equipe) {
    const prochainMot = equipe.indexMot + 1;
    const arrive = prochainMot >= partie.mots.length;
    actions.valider(equipe.id);

    if (arrive) {
      const rang = arrivees.length + 1;
      celebrer(equipe.couleur, partie.sonActif);
      setArrivee({ cle: Date.now(), equipe, rang });
      setMessage({
        cle: Date.now(),
        equipeId: equipe.id,
        texte: `${nomAvecEmoji(equipe)} : mission accomplie.`,
      });
    } else {
      setMessage({
        cle: Date.now(),
        equipeId: equipe.id,
        texte: `${nomAvecEmoji(equipe)} passent au mot ${prochainMot + 1}.`,
      });
    }
  }

  function annulerMessage() {
    if (message) {
      actions.annuler(message.equipeId);
      if (arrivee?.equipe.id === message.equipeId) setArrivee(null);
    }
    setMessage(null);
  }

  async function revenir(equipe: Equipe) {
    const ok = await demander(`Ramener ${equipe.nom} au mot ${equipe.indexMot} ?`, {
      confirmer: "Ramener",
    });
    if (ok) actions.annuler(equipe.id);
  }

  async function annulerArrivee(equipe: Equipe) {
    const ok = await demander(`Remettre ${equipe.nom} en jeu, au dernier mot ?`, {
      confirmer: "Remettre en jeu",
    });
    if (ok) actions.annuler(equipe.id);
  }

  async function nouvellePartie() {
    if (await confirmerNouvellePartie(demander)) {
      setMessage(null);
      setArrivee(null);
      actions.nouvellePartie();
    }
  }

  return (
    <div className="ecran ecran-partie">
      <Entete
        sousTitre={`${pluriel(enJeu.length, "équipe", "équipes")} en jeu, ${pluriel(arrivees.length, "arrivée", "arrivées")}`}
      >
        <button
          className="bouton-icone"
          onClick={actions.basculerMotsMasques}
          aria-pressed={partie.motsMasques}
          aria-label={partie.motsMasques ? "Afficher les mots" : "Masquer les mots"}
          title={partie.motsMasques ? "Afficher les mots" : "Masquer les mots"}
        >
          <Icone nom={partie.motsMasques ? "oeilBarre" : "oeil"} />
        </button>
        <Menu
          elements={[
            { libelle: "Modifier la partie", action: () => actions.allerA("preparation") },
            { libelle: "Voir le classement", action: () => actions.allerA("classement") },
            { libelle: partie.sonActif ? "Couper le son" : "Activer le son", action: actions.basculerSon },
            { libelle: "Nouvelle partie", action: nouvellePartie },
          ]}
        />
      </Entete>

      <main className="contenu contenu--large">
        {tousArrives ? (
          <div className="carte fin-partie">
            <p className="fin-partie-titre">Toutes les délégations sont arrivées !</p>
            <button className="bouton" onClick={() => actions.allerA("classement")}>
              Voir le classement
            </button>
          </div>
        ) : (
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
        )}

        {arrivees.length > 0 && (
          <section className="arrivees" aria-labelledby="titre-arrivees">
            <h2 id="titre-arrivees" className="titre-section">
              Arrivées
            </h2>
            <ol className="liste-arrivees carte">
              {arrivees.map((equipe, i) => (
                <li key={equipe.id} className="ligne-arrivee">
                  <span className="rang">{medaille(i + 1) ?? i + 1}</span>
                  <PastilleEquipe equipe={equipe} taille={32} />
                  <span className="ligne-arrivee-nom">{equipe.nom}</span>
                  <button
                    className="bouton-icone bouton-icone--doux"
                    onClick={() => annulerArrivee(equipe)}
                    aria-label={`Annuler l'arrivée de ${equipe.nom}`}
                    title="Annuler l'arrivée"
                  >
                    <Icone nom="retour" taille={20} />
                  </button>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      {arrivee && (
        <BandeauArrivee key={`bandeau-${arrivee.cle}`} equipe={arrivee.equipe} rang={arrivee.rang} onFin={fermerBandeau} />
      )}
      {message && (
        <MessageAnnuler key={`message-${message.cle}`} texte={message.texte} onAnnuler={annulerMessage} onFin={fermerMessage} />
      )}
    </div>
  );
}
