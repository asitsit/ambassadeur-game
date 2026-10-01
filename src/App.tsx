import { FournisseurConfirmation } from "./composants/Confirmation";
import Partie from "./ecrans/Partie";
import Preparation from "./ecrans/Preparation";
import { usePartie } from "./etat/usePartie";

// Choisit l'écran à afficher selon partie.ecran (pas besoin de routeur).
export default function App() {
  const [partie, actions] = usePartie();

  return (
    <FournisseurConfirmation>
      {partie.ecran === "preparation" ? (
        <Preparation partie={partie} actions={actions} />
      ) : (
        <Partie partie={partie} actions={actions} />
      )}
    </FournisseurConfirmation>
  );
}
