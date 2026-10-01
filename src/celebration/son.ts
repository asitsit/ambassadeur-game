/*
  Petite fanfare de 3 notes montantes, fabriquée avec la Web Audio API
  (pas de fichier audio à gérer). Sur iPhone, le son n'est autorisé qu'après
  un geste de l'utilisateur : ici, l'appui sur « Réussi ».
*/

let contexte: AudioContext | null = null;

function obtenirContexte(): AudioContext | null {
  if (contexte) return contexte;
  const Constructeur =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Constructeur) return null;
  contexte = new Constructeur();
  return contexte;
}

function note(ctx: AudioContext, frequence: number, debut: number, duree: number, volume: number) {
  const oscillateur = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillateur.type = "triangle";
  oscillateur.frequency.value = frequence;
  // Attaque rapide puis extinction douce
  gain.gain.setValueAtTime(0.0001, debut);
  gain.gain.exponentialRampToValueAtTime(volume, debut + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree);
  oscillateur.connect(gain).connect(ctx.destination);
  oscillateur.start(debut);
  oscillateur.stop(debut + duree + 0.05);
}

export function jouerFanfare(): void {
  try {
    const ctx = obtenirContexte();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime + 0.03;
    // Do, mi, sol… puis do aigu tenu avec le sol pour finir en accord
    note(ctx, 523.25, t, 0.16, 0.25);
    note(ctx, 659.25, t + 0.13, 0.16, 0.25);
    note(ctx, 783.99, t + 0.26, 0.5, 0.22);
    note(ctx, 1046.5, t + 0.26, 0.6, 0.18);
  } catch {
    // Pas de son possible : la fête continue sans
  }
}
