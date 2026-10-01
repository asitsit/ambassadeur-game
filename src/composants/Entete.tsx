import type { ReactNode } from "react";
import Logo from "./Logo";

type Props = {
  /** Petite ligne sous le nom de l'application (« 8 équipes en jeu, 2 arrivées »). */
  sousTitre?: string;
  /** Boutons à droite (œil, menu…). */
  children?: ReactNode;
};

/** En-tête fixe en haut de chaque écran. */
export default function Entete({ sousTitre, children }: Props) {
  return (
    <header className="entete">
      <Logo />
      <div className="entete-titres">
        <p className="entete-nom">L'Ambassadeur</p>
        {sousTitre && <p className="entete-sous-titre">{sousTitre}</p>}
      </div>
      {children && <div className="entete-actions">{children}</div>}
    </header>
  );
}
