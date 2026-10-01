import { createContext, useContext } from "react";

export type OptionsConfirmation = {
  /** Texte du bouton qui confirme (par défaut « Continuer »). */
  confirmer?: string;
  /** Bouton rouge pour les actions qui effacent quelque chose. */
  danger?: boolean;
};

export type Demander = (message: string, options?: OptionsConfirmation) => Promise<boolean>;

// Par défaut (hors fournisseur), on se rabat sur la boîte de dialogue du navigateur
export const ContexteConfirmation = createContext<Demander>((message) =>
  Promise.resolve(window.confirm(message)),
);

/** Ouvre une fenêtre de confirmation et attend la réponse : `if (await demander("…")) { … }` */
export function useConfirmation(): Demander {
  return useContext(ContexteConfirmation);
}
