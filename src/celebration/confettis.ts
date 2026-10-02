import confetti from "canvas-confetti";
import { OR_DU_SCEAU } from "../constantes";

const DUREE = 1200;

export function animationsReduites(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/** Confettis aux couleurs de l'équipe et en Or du sceau, lancés des deux côtés pendant un peu plus d'une seconde. */
export function lancerConfettis(couleurEquipe: string): void {
  if (animationsReduites()) return;
  const couleurs = [couleurEquipe, OR_DU_SCEAU, couleurEquipe, "#FFFFFF"];
  const fin = Date.now() + DUREE;

  confetti({ particleCount: 110, spread: 90, startVelocity: 50, origin: { y: 0.6 }, colors: couleurs });

  (function image() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: couleurs });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: couleurs });
    if (Date.now() < fin) requestAnimationFrame(image);
  })();
}
