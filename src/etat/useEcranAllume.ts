import { useEffect } from "react";

/**
 * Empêche la mise en veille de l'écran tant que le composant est affiché (API Wake Lock).
 * Le navigateur relâche le verrou quand on change d'onglet : on le redemande au retour.
 * Sans prise en charge (anciens navigateurs), il ne se passe rien.
 */
export function useEcranAllume(): void {
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let verrou: WakeLockSentinel | null = null;
    let actif = true;

    async function demander() {
      try {
        const nouveau = await navigator.wakeLock.request("screen");
        if (actif) verrou = nouveau;
        else void nouveau.release();
      } catch {
        // Refusé (batterie faible, onglet caché…) : tant pis
      }
    }

    function auRetour() {
      if (document.visibilityState === "visible") void demander();
    }

    void demander();
    document.addEventListener("visibilitychange", auRetour);
    return () => {
      actif = false;
      document.removeEventListener("visibilitychange", auRetour);
      void verrou?.release();
    };
  }, []);
}
