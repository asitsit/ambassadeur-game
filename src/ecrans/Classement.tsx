import Entete from "../composants/Entete";
import PastilleEquipe from "../composants/PastilleEquipe";
import Podium from "../composants/Podium";
import { useConfirmation } from "../etat/confirmation";
import { confirmerNouvellePartie, confirmerRecommencer } from "../etat/nouvellePartie";
import { equipesArrivees, equipesEnJeu } from "../etat/regles";
import type { ActionsPartie } from "../etat/usePartie";
import type { Partie } from "../types";

type Props = { partie: Partie; actions: ActionsPartie };

export default function Classement({ partie, actions }: Props) {
  const demander = useConfirmation();
  const arrivees = equipesArrivees(partie.equipes);
  // Les équipes encore en jeu, de la plus avancée à la moins avancée
  const enJeu = [...equipesEnJeu(partie.equipes)].sort((a, b) => b.indexMot - a.indexMot);
  const toutesArrivees = partie.equipes.length > 0 && enJeu.length === 0;

  async function recommencer() {
    if (await confirmerRecommencer(demander)) {
      actions.recommencerPartie();
      actions.allerA("partie");
    }
  }

  async function nouvellePartie() {
    if (await confirmerNouvellePartie(demander)) actions.nouvellePartie();
  }

  return (
    <div className="ecran">
      <Entete sousTitre="Classement" />

      <main className="contenu classement">
        <h1 className="titre-classement">{toutesArrivees ? "Mission accomplie !" : "Classement provisoire"}</h1>

        {arrivees.length > 0 ? (
          <Podium arrivees={arrivees} />
        ) : (
          <p className="vide">Aucune délégation n'est encore arrivée.</p>
        )}

        {(arrivees.length > 3 || enJeu.length > 0) && (
          <ol className="liste-arrivees carte">
            {arrivees.slice(3).map((equipe, i) => (
              <li key={equipe.id} className="ligne-arrivee">
                <span className="rang">{i + 4}</span>
                <PastilleEquipe equipe={equipe} taille={32} />
                <span className="ligne-arrivee-nom">{equipe.nom}</span>
              </li>
            ))}
            {enJeu.map((equipe) => (
              <li key={equipe.id} className="ligne-arrivee ligne-arrivee--en-jeu">
                <span className="rang">·</span>
                <PastilleEquipe equipe={equipe} taille={32} />
                <span className="ligne-arrivee-nom">{equipe.nom}</span>
                <span className="etape">
                  Mot {equipe.indexMot + 1} sur {partie.mots.length}
                </span>
              </li>
            ))}
          </ol>
        )}
      </main>

      <footer className="barre-bas">
        <button className="bouton bouton--large" onClick={() => actions.allerA("partie")}>
          Retour à la partie
        </button>
        <div className="barre-bas-paire">
          <button className="bouton bouton--secondaire" onClick={recommencer}>
            Recommencer
          </button>
          <button className="bouton bouton--secondaire" onClick={nouvellePartie}>
            Nouvelle partie
          </button>
        </div>
      </footer>
    </div>
  );
}
