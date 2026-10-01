type Props = { taille?: number };

/** Sceau de L'Ambassadeur (provisoire : 🎭 en attendant le dessin SVG). */
export default function Logo({ taille = 40 }: Props) {
  return (
    <span className="logo-provisoire" style={{ width: taille, height: taille }} aria-hidden="true">
      🎭
    </span>
  );
}
