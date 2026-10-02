import { useEffect, useState } from "react";
import Icone from "./Icone";

export type ElementMenu = {
  libelle: string;
  action: () => void;
};

type Props = { elements: ElementMenu[] };

/** Bouton ⋯ qui ouvre une petite liste d'actions sous l'en-tête. */
export default function Menu({ elements }: Props) {
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    if (!ouvert) return;
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [ouvert]);

  return (
    <div className="menu">
      <button
        className="bouton-icone"
        onClick={() => setOuvert((o) => !o)}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={ouvert}
      >
        <Icone nom="menu" />
      </button>
      {ouvert && (
        <>
          <div className="menu-voile" onClick={() => setOuvert(false)} />
          <ul className="menu-liste carte" role="menu">
            {elements.map((el) => (
              <li key={el.libelle} role="none">
                <button
                  role="menuitem"
                  className="menu-element"
                  onClick={() => {
                    setOuvert(false);
                    el.action();
                  }}
                >
                  {el.libelle}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
