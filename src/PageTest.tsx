/*
  Page de test du thème (étape 1).
  Elle sert seulement à vérifier les couleurs, polices, cartes et boutons.
  Elle sera supprimée quand les vrais écrans existeront.
*/
import "./PageTest.css";

const palette = [
  { nom: "Papier visa", variable: "--papier-visa" },
  { nom: "Blanc", variable: "--blanc" },
  { nom: "Bleu ambassade", variable: "--bleu-ambassade" },
  { nom: "Encre", variable: "--encre" },
  { nom: "Encre pâle", variable: "--encre-pale" },
  { nom: "Vert visa", variable: "--vert-visa" },
  { nom: "Or du sceau", variable: "--or-du-sceau" },
  { nom: "Rouge cachet", variable: "--rouge-cachet" },
  { nom: "Filigrane", variable: "--filigrane" },
];

// Exemple d'équipe, en dur pour l'instant
const equipe = { nom: "Les Renards", emoji: "🦊", couleur: "#E8483B" };
const nombreDeMots = 12;
const motEnCours = 3; // 0 = premier mot, donc ici « Mot 4 sur 12 »

export default function PageTest() {
  return (
    <div className="test">
      <header className="test-entete">
        <span className="test-logo" aria-hidden="true">🎭</span>
        <h1>L'Ambassadeur</h1>
      </header>

      <main className="test-contenu">
        <section>
          <h2>Palette</h2>
          <div className="test-palette">
            {palette.map((c) => (
              <div key={c.variable} className="test-nuance">
                <span className="test-echantillon" style={{ background: `var(${c.variable})` }} />
                <span>{c.nom}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Typographie</h2>
          <div className="carte test-typo">
            <p className="test-mot">Éléphant de mer</p>
            <p className="test-nom">Les Renards (nom d'équipe)</p>
            <p>Texte courant : Aucune équipe pour l'instant. Ajoutez la première délégation !</p>
            <p className="test-petit">Petit texte : 8 équipes en jeu, 2 arrivées</p>
          </div>
        </section>

        <section>
          <h2>Carte d'équipe</h2>
          <article className="carte test-carte-equipe" style={{ borderLeftColor: equipe.couleur }}>
            <div className="test-carte-haut">
              <span className="test-pastille" style={{ background: equipe.couleur }}>
                {equipe.emoji}
              </span>
              <div>
                <p className="test-nom">{equipe.nom}</p>
                <p className="test-petit">Mot {motEnCours + 1} sur {nombreDeMots}</p>
              </div>
            </div>
            <p className="test-mot">Girafe</p>
            <div className="test-passeport" aria-label="Passeport">
              {Array.from({ length: nombreDeMots }, (_, i) => (
                <span
                  key={i}
                  className={
                    "test-case" +
                    (i < motEnCours ? " test-case--tamponnee" : "") +
                    (i === motEnCours ? " test-case--en-cours" : "")
                  }
                  style={i < motEnCours ? { background: equipe.couleur } : undefined}
                />
              ))}
            </div>
            <button className="bouton bouton--succes bouton--large">Réussi</button>
          </article>
        </section>

        <section>
          <h2>Boutons</h2>
          <div className="test-boutons">
            <button className="bouton bouton--large">Lancer la partie</button>
            <button className="bouton bouton--secondaire bouton--large">Ajouter une équipe</button>
            <button className="bouton bouton--danger">Supprimer</button>
            <button className="bouton" disabled>20 équipes au maximum</button>
            <div>
              <button className="bouton-icone" aria-label="Masquer les mots">👁️</button>
              <button className="bouton-icone" aria-label="Menu">⋯</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
