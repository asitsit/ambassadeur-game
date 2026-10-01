import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ContexteConfirmation, type OptionsConfirmation } from "../etat/confirmation";

type Demande = OptionsConfirmation & {
  message: string;
  repondre: (ok: boolean) => void;
};

/** Affiche les fenêtres de confirmation demandées avec useConfirmation(). */
export function FournisseurConfirmation({ children }: { children: ReactNode }) {
  const [demande, setDemande] = useState<Demande | null>(null);
  const boutonConfirmer = useRef<HTMLButtonElement>(null);

  const demander = useCallback(
    (message: string, options: OptionsConfirmation = {}) =>
      new Promise<boolean>((resoudre) => {
        setDemande({ ...options, message, repondre: resoudre });
      }),
    [],
  );

  const repondre = useCallback(
    (ok: boolean) => {
      demande?.repondre(ok);
      setDemande(null);
    },
    [demande],
  );

  useEffect(() => {
    if (!demande) return;
    boutonConfirmer.current?.focus();
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") repondre(false);
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [demande, repondre]);

  return (
    <ContexteConfirmation.Provider value={demander}>
      {children}
      {demande && (
        <div className="voile" onClick={() => repondre(false)}>
          <div
            className="fenetre carte"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="fenetre-message"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="fenetre-message" className="fenetre-message">
              {demande.message}
            </p>
            <div className="fenetre-boutons">
              <button className="bouton bouton--secondaire" onClick={() => repondre(false)}>
                Annuler
              </button>
              <button
                ref={boutonConfirmer}
                className={"bouton" + (demande.danger ? " bouton--danger" : "")}
                onClick={() => repondre(true)}
              >
                {demande.confirmer ?? "Continuer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ContexteConfirmation.Provider>
  );
}
