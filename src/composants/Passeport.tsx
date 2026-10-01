import { useEffect, useRef, type CSSProperties } from "react";
import { couleurTexteSur } from "../constantes";
import type { Equipe } from "../types";

type Props = {
  equipe: Equipe;
  nombreDeMots: number;
};

// Contour irrégulier façon encre : un cercle dont le rayon varie un peu (calculé une seule fois)
const VARIATIONS = [0.6, 0.1, 0.8, 0.3, 0.9, 0.2, 0.5, 0.7, 0, 0.6, 0.4, 0.9, 0.1, 0.7, 0.3, 0.8];
const CONTOUR_TAMPON =
  VARIATIONS.map((v, i) => {
    const angle = (i / VARIATIONS.length) * Math.PI * 2;
    const rayon = 9 + v * 1;
    return `${i === 0 ? "M" : "L"}${(10 + Math.cos(angle) * rayon).toFixed(2)} ${(10 + Math.sin(angle) * rayon).toFixed(2)}`;
  }).join(" ") + " Z";

/** Inclinaison du tampon entre -12° et 12°, toujours la même pour une case donnée. */
function inclinaison(graine: string, index: number): number {
  let h = index * 31;
  for (let i = 0; i < graine.length; i++) h = (h * 33 + graine.charCodeAt(i)) % 100003;
  return (h % 25) - 12;
}

/** Rangée de cases, une par mot : tampon pour les mots trouvés, case entourée pour le mot en cours. */
export default function Passeport({ equipe, nombreDeMots }: Props) {
  // Seuls les tampons posés pendant que la carte est affichée sont animés
  // (pas tous les tampons d'un coup au rechargement de la page).
  const dejaTamponnes = useRef(equipe.indexMot);
  useEffect(() => {
    if (equipe.indexMot < dejaTamponnes.current) dejaTamponnes.current = equipe.indexMot;
  }, [equipe.indexMot]);

  const encre = couleurTexteSur(equipe.couleur);

  return (
    <div
      className="passeport"
      role="img"
      aria-label={`Passeport : ${Math.min(equipe.indexMot, nombreDeMots)} tampons sur ${nombreDeMots}`}
    >
      {Array.from({ length: nombreDeMots }, (_, i) => {
        const tamponne = i < equipe.indexMot;
        const enCours = i === equipe.indexMot;
        return (
          <span key={i} className={"case" + (enCours ? " case--en-cours" : "")}>
            {tamponne && (
              <svg
                className={"tampon" + (i >= dejaTamponnes.current ? " tampon--nouveau" : "")}
                viewBox="0 0 20 20"
                style={{ "--inclinaison": `${inclinaison(equipe.id, i)}deg` } as CSSProperties}
              >
                <path d={CONTOUR_TAMPON} fill={equipe.couleur} />
                <circle cx="10" cy="10" r="6.2" fill="none" stroke={encre} strokeOpacity="0.55" strokeWidth="1" />
                <path
                  d="M6.6 10.3 L9 12.6 L13.6 7.6"
                  fill="none"
                  stroke={encre}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
}
