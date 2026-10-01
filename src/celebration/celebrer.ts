import { lancerConfettis } from "./confettis";
import { jouerFanfare } from "./son";

/** Arrivée d'une équipe : confettis, fanfare (si le son est actif) et vibration (Android). */
export function celebrer(couleurEquipe: string, sonActif: boolean): void {
  lancerConfettis(couleurEquipe);
  if (sonActif) jouerFanfare();
  try {
    // Non pris en charge par Safari sur iPhone : il ne se passe rien
    navigator.vibrate?.([120, 60, 180]);
  } catch {
    // ignoré
  }
}
