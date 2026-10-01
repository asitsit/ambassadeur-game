import { useEffect, useState } from "react";
import { COULEURS_EQUIPE, EMOJIS, couleurTexteSur } from "../constantes";
import { initiale } from "../etat/regles";
import type { ModificationEquipe } from "../etat/usePartie";
import type { Equipe } from "../types";
import PastilleEquipe from "./PastilleEquipe";

type Props = {
  equipe: Equipe;
  equipes: Equipe[];
  onModifier: (modification: ModificationEquipe) => void;
  onFermer: () => void;
};

/** Premier caractère visible d'un texte (un emoji peut être composé de plusieurs caractères). */
function premierSymbole(texte: string): string | null {
  const propre = texte.trim();
  if (!propre) return null;
  if ("Segmenter" in Intl) {
    const segment = new Intl.Segmenter("fr", { granularity: "grapheme" }).segment(propre);
    return segment[Symbol.iterator]().next().value?.segment ?? null;
  }
  return Array.from(propre)[0] ?? null;
}

/** Panneau du bas : choix de la couleur (une par équipe) et de l'emoji. */
export default function ChoixCouleurEmoji({ equipe, equipes, onModifier, onFermer }: Props) {
  const [emojiLibre, setEmojiLibre] = useState("");

  useEffect(() => {
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFermer();
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [onFermer]);

  const proprietaire = (hex: string) =>
    equipes.find((e) => e.id !== equipe.id && e.couleur.toLowerCase() === hex.toLowerCase());

  return (
    <div className="voile voile--panneau" onClick={onFermer}>
      <div
        className="panneau"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panneau-titre"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panneau-poignee" aria-hidden="true" />
        <div className="panneau-entete">
          <PastilleEquipe equipe={equipe} taille={48} />
          <h2 id="panneau-titre" className="panneau-titre">
            {equipe.nom.trim() || "Équipe sans nom"}
          </h2>
        </div>

        <h3 className="panneau-sous-titre">Couleur</h3>
        <div className="grille-couleurs">
          {COULEURS_EQUIPE.map((c) => {
            const prise = proprietaire(c.hex);
            const choisie = equipe.couleur.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                className={"choix-couleur" + (choisie ? " choix-couleur--choisie" : "")}
                style={{ background: c.hex, color: couleurTexteSur(c.hex) }}
                disabled={prise !== undefined}
                onClick={() => onModifier({ couleur: c.hex })}
                aria-label={prise ? `${c.nom}, prise par ${prise.nom}` : c.nom}
                aria-pressed={choisie}
                title={prise ? `${c.nom} (${prise.nom})` : c.nom}
              >
                {choisie && "✓"}
                {prise && (
                  <span className="choix-couleur-proprietaire">
                    <PastilleEquipe equipe={prise} taille={22} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <h3 className="panneau-sous-titre">Emoji</h3>
        <div className="grille-emojis">
          <button
            className={"choix-emoji choix-emoji--aucun" + (equipe.emoji === null ? " choix-emoji--choisi" : "")}
            onClick={() => onModifier({ emoji: null })}
            aria-pressed={equipe.emoji === null}
            aria-label="Pas d'emoji : afficher l'initiale"
            title="Pas d'emoji"
          >
            {initiale(equipe.nom)}
          </button>
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className={"choix-emoji" + (equipe.emoji === emoji ? " choix-emoji--choisi" : "")}
              onClick={() => onModifier({ emoji })}
              aria-pressed={equipe.emoji === emoji}
            >
              {emoji}
            </button>
          ))}
        </div>

        <label className="aide" htmlFor="emoji-libre">
          Ou coller un autre emoji :
        </label>
        <input
          id="emoji-libre"
          className="champ champ--emoji"
          value={emojiLibre}
          onChange={(e) => {
            setEmojiLibre(e.target.value);
            const symbole = premierSymbole(e.target.value);
            if (symbole) onModifier({ emoji: symbole });
          }}
          placeholder="Coller ici"
          autoComplete="off"
        />

        <button className="bouton bouton--large" onClick={onFermer}>
          Terminé
        </button>
      </div>
    </div>
  );
}
