type Props = { taille?: number };

const CONTOUR_SCEAU =
  "M62.8 32.0L62.2 33.7L60.8 35.2L59.3 36.6L58.5 38.1L58.6 39.7L59.4 41.6L60.0 43.6L59.7 45.4L58.5 46.6L56.6 47.4L54.6 48.0L53.3 49.0L52.7 50.5L52.5 52.5L52.2 54.6L51.2 56.1L49.5 56.7L47.4 56.6L45.4 56.3L43.8 56.5L42.6 57.6L41.6 59.4L40.4 61.1L38.9 62.0L37.1 61.8L35.2 60.8L33.6 59.7L32.0 59.2L30.4 59.7L28.8 60.8L26.9 61.8L25.1 62.0L23.6 61.1L22.4 59.4L21.4 57.6L20.2 56.5L18.6 56.3L16.6 56.6L14.5 56.7L12.8 56.1L11.8 54.6L11.5 52.5L11.3 50.5L10.7 49.0L9.4 48.0L7.4 47.4L5.5 46.6L4.3 45.4L4.0 43.6L4.6 41.6L5.4 39.7L5.5 38.1L4.7 36.6L3.2 35.2L1.8 33.7L1.2 32.0L1.8 30.3L3.2 28.8L4.7 27.4L5.5 25.9L5.4 24.3L4.6 22.4L4.0 20.4L4.3 18.6L5.5 17.4L7.4 16.6L9.4 16.0L10.7 15.0L11.3 13.5L11.5 11.5L11.8 9.4L12.8 7.9L14.5 7.3L16.6 7.4L18.6 7.7L20.2 7.5L21.4 6.4L22.4 4.6L23.6 2.9L25.1 2.0L26.9 2.2L28.8 3.2L30.4 4.3L32.0 4.8L33.6 4.3L35.2 3.2L37.1 2.2L38.9 2.0L40.4 2.9L41.6 4.6L42.6 6.4L43.8 7.5L45.4 7.7L47.4 7.4L49.5 7.3L51.2 7.9L52.2 9.4L52.5 11.5L52.7 13.5L53.3 15.0L54.6 16.0L56.6 16.6L58.5 17.4L59.7 18.6L60.0 20.4L59.4 22.4L58.6 24.3L58.5 25.9L59.3 27.4L60.8 28.8L62.2 30.3Z";

/** Sceau de L'Ambassadeur : cachet de cire doré avec un petit mime aux mains levées. */
export default function Logo({ taille = 40 }: Props) {
  return (
    <svg className="logo" width={taille} height={taille} viewBox="0 0 64 64" aria-hidden="true">
      <path d={CONTOUR_SCEAU} fill="#FFC53D" stroke="#D99A12" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="21.5" fill="none" stroke="#D99A12" strokeWidth="1.6" />
      <g stroke="#7A4A06" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24.5 37 Q19.5 31 20.5 24" fill="none" />
        <path d="M39.5 37 Q44.5 31 43.5 24" fill="none" />
        <circle cx="20.3" cy="21.6" r="2.9" fill="#FFE29A" />
        <circle cx="43.7" cy="21.6" r="2.9" fill="#FFE29A" />
        <circle cx="32" cy="36" r="9.5" fill="#FFE29A" />
        <path d="M28 39.2 Q32 43 36 39.2" fill="none" strokeWidth="2.2" />
      </g>
      <circle cx="28.6" cy="34.6" r="1.5" fill="#7A4A06" />
      <circle cx="35.4" cy="34.6" r="1.5" fill="#7A4A06" />
    </svg>
  );
}
