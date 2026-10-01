import CarteEquipe from "../composants/CarteEquipe";
import Entete from "../composants/Entete";
import { equipesArrivees, equipesEnJeu } from "../etat/regles";
import type { ActionsPartie } from "../etat/usePartie";
import type { Equipe, Partie as TypePartie } from "../types";

type Props = { partie: TypePartie; actions: ActionsPartie };

export default function Partie({ partie, actions }: Props) {
  const enJeu = equipesEnJeu(partie.equipes);
  const arrivees = equipesArrivees(partie.equipes);

  function reussi(equipe: Equipe) {
    actions.valider(equipe.id);
  }

  return (
    <div className="ecran">
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
              onRevenir={(e) => actions.annuler(e.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
