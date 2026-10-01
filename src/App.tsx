import { FournisseurConfirmation } from "./composants/Confirmation";
import Classement from "./ecrans/Classement";
import Partie from "./ecrans/Partie";
import Preparation from "./ecrans/Preparation";
import { usePartie } from "./etat/usePartie";

// Choisit l'écran à afficher selon partie.ecran (pas besoin de routeur).
export default function App() {
  const [partie, actions] = usePartie();

  return (
    <FournisseurConfirmation>
      {partie.ecran === "preparation" && <Preparation partie={partie} actions={actions} />}
      {partie.ecran === "partie" && <Partie partie={partie} actions={actions} />}
      {partie.ecran === "classement" && <Classement partie={partie} actions={actions} />}
    </FournisseurConfirmation>
  );
}
