# L'Ambassadeur

Application web pour téléphone qui aide le maître du jeu à suivre la progression des équipes pendant le jeu de l'ambassadeur.

Tout le cadrage est dans [CAHIER_DES_CHARGES.md](CAHIER_DES_CHARGES.md).

## Commandes

- `npm run dev` : lance l'application en local (http://localhost:5173).
- `npm run dev -- --host` : pareil, accessible depuis un téléphone sur le même wifi.
- `npm run build` : construit la version à mettre en ligne (dossier `dist`).

## Mise en ligne

Le dépôt GitHub est relié à Vercel : chaque `git push` sur `main` remet l'application à jour.
Réglages Vercel : framework « Vite », commande `npm run build`, dossier de sortie `dist`.
