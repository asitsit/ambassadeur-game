# L'Ambassadeur : cahier des charges (version 1)

Ce document décrit l'application à construire. Il est écrit pour être lu par toi et par un assistant de code (Copilot, Claude, etc.) dans VS Code. Tu peux le placer à la racine du projet sous le nom `CAHIER_DES_CHARGES.md` et demander à l'assistant de s'y référer.

---

## 1. Résumé

**L'Ambassadeur** est une application web pour téléphone qui aide le maître du jeu à suivre la progression de plusieurs équipes (jusqu'à 20) pendant le jeu de l'ambassadeur.

- Un seul utilisateur : le maître du jeu.
- Pas de compte, pas de serveur : tout est enregistré dans le navigateur du téléphone.
- Public des parties : familles (enfants et adultes ensemble).
- Langue : français uniquement.

## 2. Règles du jeu (rappel)

1. Le maître du jeu prépare une liste de mots, dans un ordre précis.
2. Toutes les équipes jouent avec exactement la même liste, dans le même ordre.
3. Chaque équipe envoie un ambassadeur voir le maître du jeu, qui lui donne le mot en cours de son équipe.
4. L'ambassadeur retourne mimer ce mot à son équipe.
5. La personne qui devine vient dire le mot au maître du jeu.
6. Si c'est juste, le maître du jeu touche « Réussi » : l'équipe passe au mot suivant.
7. Une équipe a terminé quand elle a trouvé le dernier mot. Le jeu continue jusqu'à ce que toutes les équipes aient terminé (ou que le maître du jeu arrête). Le classement suit l'ordre d'arrivée.

Le maître du jeu peut faire passer un mot à une équipe en touchant « Réussi » même si le mot n'a pas été trouvé. Il n'y a pas de bouton « Passer » séparé.

## 3. Périmètre

### Dans la version 1
- Saisir une liste de mots.
- Créer jusqu'à 20 équipes avec nom, couleur et emoji.
- Suivre la progression de chaque équipe et valider les mots.
- Annuler une validation faite par erreur.
- Masquer les mots à l'écran.
- Afficher le classement des arrivées.
- Fêter l'arrivée d'une équipe (confettis, son court, vibration si disponible).
- Conserver la partie si la page est rechargée ou fermée.

### Hors version 1 (ne pas développer)
- Bibliothèque de plusieurs listes de mots.
- Chronomètre.
- Historique des parties, statistiques, export.
- Comptes, synchronisation entre appareils.
- Mode hors ligne installable (PWA).
- Plusieurs langues.

## 4. Écrans et fonctionnalités

L'application a trois écrans. Pas besoin de système de routes (pas de React Router) : un simple état `ecran` suffit.

### 4.1 Écran « Préparation »

Affiché au premier lancement, ou quand le maître du jeu veut modifier la partie.

**Bloc « Les mots »**
- Une grande zone de texte : un mot ou une expression par ligne.
- Les lignes vides et les espaces en début ou fin de ligne sont ignorés.
- Compteur sous la zone : « 12 mots ».
- Bouton « Mélanger l'ordre » : mélange la liste une fois (l'ordre reste ensuite le même pour toutes les équipes).

**Bloc « Les équipes »**
- Liste des équipes, chacune sur une ligne avec :
  - une pastille ronde de sa couleur contenant son emoji (toucher pour modifier) ;
  - son nom (champ texte modifiable) ;
  - un bouton pour la supprimer.
- Bouton « Ajouter une équipe » : crée une équipe avec un nom par défaut (« Équipe 4 »), la prochaine couleur libre et un emoji libre de la palette (voir section 5.6).
- Le bouton est désactivé à 20 équipes, avec le message « 20 équipes au maximum ».
- Toucher la pastille ouvre un panneau (bottom sheet) avec :
  - la grille des 20 couleurs d'équipe (celles déjà prises sont grisées) ;
  - une grille d'environ 30 emojis proposés ;
  - un champ pour coller n'importe quel autre emoji.
  - L'emoji est optionnel : sans emoji, la pastille affiche l'initiale du nom.

**Bouton principal en bas : « Lancer la partie »**

Vérifications avant de lancer, avec messages clairs :
- au moins 1 mot : « Ajoutez au moins un mot pour commencer. » ;
- au moins 1 équipe : « Ajoutez au moins une équipe. » ;
- pas de nom vide : « Donnez un nom à chaque équipe. » ;
- pas deux noms identiques (sans tenir compte des majuscules) : « Deux équipes s'appellent "Les Renards". Changez l'un des noms. ».

**Modifier une partie en cours**
- Changer les noms, couleurs, emojis : sans effet sur la progression.
- Ajouter une équipe : elle commence au premier mot.
- Supprimer une équipe : demander confirmation.
- Modifier la liste de mots : demander confirmation, car la progression de toutes les équipes repart de zéro. Texte : « La liste de mots a changé. Toutes les équipes vont repartir du premier mot. Continuer ? »

### 4.2 Écran « Partie » (écran principal)

C'est l'écran utilisé 95 % du temps, debout, d'une main, avec des gens qui attendent. Priorités : retrouver une équipe en une seconde, valider en un geste.

**En-tête (fixe en haut)**
- Logo et nom « L'Ambassadeur ».
- Résumé : « 8 équipes en jeu, 2 arrivées ».
- Bouton œil : masquer ou afficher les mots.
- Bouton menu (⋯) avec : « Modifier la partie », « Voir le classement », « Couper le son » / « Activer le son », « Nouvelle partie ».

**Liste des équipes en jeu**
- Une colonne sur téléphone, deux ou trois colonnes sur tablette et ordinateur.
- L'ordre des équipes ne change jamais pendant la partie (le maître du jeu mémorise où se trouve chaque équipe). Seules les équipes arrivées quittent cette liste.

**Carte d'une équipe**
- Bande ou bordure à gauche dans la couleur de l'équipe.
- Pastille couleur + emoji, nom de l'équipe.
- Étape : « Mot 4 sur 12 ».
- Le mot en cours, en grand (ou « Mot caché » si les mots sont masqués ; toucher le texte le révèle pendant 3 secondes).
- Le passeport : une rangée de petites cases, une par mot. Les mots trouvés portent un tampon de la couleur de l'équipe, la case du mot en cours est entourée, les suivantes sont vides.
- Bouton « Réussi » : large, en bas de la carte, hauteur minimum 52 px.

**Toucher « Réussi »**
- L'équipe passe immédiatement au mot suivant (pas de fenêtre de confirmation, pour aller vite).
- Animation discrète : un tampon se pose dans la case du passeport (environ 300 ms). Pas de son.
- Un message apparaît en bas pendant 5 secondes : « Les Renards 🦊 passent au mot 5. » avec un bouton « Annuler ».
- « Annuler » ramène l'équipe au mot précédent.
- Protection contre le double appui : ignorer un deuxième appui sur le même bouton pendant 600 ms.

**Annuler plus tard**
- Un appui long (ou un petit bouton ↩︎ discret) sur la carte permet aussi de revenir d'un mot, avec confirmation : « Ramener Les Renards au mot 3 ? ».

**Quand une équipe trouve le dernier mot**
- Célébration (voir section 5.7) : confettis aux couleurs de l'équipe, son court, vibration si le téléphone le permet.
- Grand bandeau pendant 3 secondes : « 🦊 Les Renards : mission accomplie ! 1re place ».
- La carte quitte la liste « En jeu » et rejoint la section « Arrivées ».

**Section « Arrivées » (sous la liste en jeu)**
- Liste compacte, dans l'ordre d'arrivée : rang, pastille, nom.
- Les 3 premiers ont une médaille 🥇 🥈 🥉.
- On peut annuler l'arrivée d'une équipe (elle revient au dernier mot et le classement se recalcule).

**Quand toutes les équipes sont arrivées**
- Ouverture automatique de l'écran « Classement ».

### 4.3 Écran « Classement »

- Titre : « Mission accomplie ! » si tout le monde a fini, sinon « Classement provisoire ».
- Podium visuel pour les 3 premières équipes (marches de hauteurs différentes, couleur et emoji de chaque équipe).
- Liste des autres équipes arrivées, puis des équipes encore en jeu avec leur étape (« Mot 7 sur 12 »).
- Boutons : « Retour à la partie » et « Nouvelle partie ».

**Nouvelle partie**
- Confirmation : « Remettre toutes les équipes au premier mot ? Les mots et les équipes sont conservés. »
- Remet toutes les équipes au premier mot et vide le classement.

## 5. Direction artistique

### 5.1 Concept

**Le passeport diplomatique.** Chaque équipe est une délégation qui doit faire tamponner son passeport à chaque mot trouvé. Le maître du jeu est le chef du protocole. C'est l'élément mémorable de l'application : les tampons. Tout le reste reste simple et très lisible.

Ambiance : joyeuse, colorée, familiale, un peu cérémonieuse pour rire (médailles, sceaux, « mission accomplie »), sans jamais nuire à la lisibilité en pleine partie.

### 5.2 Palette de l'interface

| Rôle | Nom | Hex |
|---|---|---|
| Fond principal | Papier visa | `#EEF3FF` |
| Surfaces (cartes) | Blanc | `#FFFFFF` |
| Couleur principale (boutons, en-tête) | Bleu ambassade | `#2D3FA8` |
| Texte | Encre | `#1C2147` |
| Texte secondaire | Encre pâle | `#5D6490` |
| Validation, succès | Vert visa | `#1FA672` |
| Célébration, médailles | Or du sceau | `#FFC53D` |
| Danger (suppression) | Rouge cachet | `#D9364A` |
| Bordures et cases vides | Filigrane | `#D5DCF2` |

Le fond peut porter un motif très léger de guilloché (les lignes ondulées des passeports), en SVG, à 5 % d'opacité maximum. Il doit rester invisible derrière le texte.

**Mode sombre** : facultatif en version 1. Si on le fait, il suit le réglage du téléphone, avec fond `#141832`, cartes `#1F2550`, texte `#EEF1FF`.

### 5.3 Typographie

Deux polices Google Fonts, chargées via `@fontsource` (installation par npm, voir section 7) :

- **Fredoka** (titres, mot en cours, rangs, boutons) : arrondie, chaleureuse, très familiale. Graisses 500 et 700.
- **Atkinson Hyperlegible** (textes, noms d'équipes, messages) : conçue pour être lisible au premier coup d'œil, utile debout et en mouvement. Graisses 400 et 700.

Échelle (sur téléphone) :
- mot en cours : 28 px, Fredoka 700 ;
- titres d'écran : 24 px, Fredoka 700 ;
- nom d'équipe : 18 px, Atkinson 700 ;
- texte courant : 16 px, Atkinson 400 ;
- petits textes : 14 px minimum.

Pas de texte tout en majuscules, sauf éventuellement le tampon « VALIDÉ » dans les illustrations.

### 5.4 Formes

- Cartes : coins arrondis 18 px, bordure de 1 px couleur Filigrane, ombre douce colorée (bleu, pas gris).
- Boutons principaux : forme pilule (coins entièrement arrondis), hauteur 52 px minimum.
- Cases du passeport : petits carrés arrondis de 14 px environ ; tampon = cercle légèrement penché (rotation aléatoire entre -12° et 12°) avec un contour irrégulier façon encre.
- Pastilles d'équipe : cercles de 40 px.

### 5.5 Logo et icône

- Logo : un sceau rond (comme un cachet de cire) couleur Or du sceau, avec un petit visage qui mime (deux mains levées), et le texte « L'Ambassadeur » en Fredoka à côté.
- Favicon et icône d'écran d'accueil : le sceau seul.
- À réaliser en SVG simple. Si c'est trop complexe au début, utiliser l'emoji 🎭 en attendant.

### 5.6 Couleurs et emojis d'équipe

20 couleurs, une par équipe possible : deux équipes n'ont jamais la même couleur. Elles sont listées dans l'ordre d'attribution, pensé pour que les premières équipes aient des couleurs très différentes les unes des autres.

| Ordre | Nom | Hex | Texte dessus |
|---|---|---|---|
| 1 | Tomate | `#E8483B` | blanc |
| 2 | Lagon | `#1E9BD7` | blanc |
| 3 | Soleil | `#F5C518` | encre |
| 4 | Pomme | `#5BB33E` | encre |
| 5 | Raisin | `#7B4BC9` | blanc |
| 6 | Mandarine | `#F28A1E` | encre |
| 7 | Menthe | `#1FB59A` | encre |
| 8 | Fuchsia | `#D63E9B` | blanc |
| 9 | Cacao | `#8A5A3C` | blanc |
| 10 | Myrtille | `#3D5BD9` | blanc |
| 11 | Citron vert | `#A8D83A` | encre |
| 12 | Rose bonbon | `#F59AC0` | encre |
| 13 | Ardoise | `#5B6577` | blanc |
| 14 | Ciel | `#7CC6F2` | encre |
| 15 | Framboise | `#B8264F` | blanc |
| 16 | Sapin | `#1F7A4D` | blanc |
| 17 | Abricot | `#F7B27A` | encre |
| 18 | Lavande | `#B39DF0` | encre |
| 19 | Pétrole | `#0F6E7A` | blanc |
| 20 | Nuit | `#232A63` | blanc |

Règles :
- Attribution automatique : chaque nouvelle équipe reçoit la première couleur libre dans l'ordre du tableau.
- Une couleur ne peut appartenir qu'à une seule équipe. Dans le panneau de choix, les couleurs déjà prises sont grisées, avec la mini pastille de l'équipe qui l'utilise, et ne sont pas sélectionnables.
- Supprimer une équipe libère sa couleur.

Avec 20 couleurs, certaines paires restent proches (par exemple Tomate et Framboise, ou Lagon et Ciel). L'emoji et le nom aident à les distinguer. **Je te conseille de vérifier les contrastes** avec un outil en ligne de vérification WCAG : j'ai choisi la couleur de texte à l'œil, pas avec un calcul.

Emojis proposés (animaux et objets faciles à reconnaître pour les enfants) :
🦊 🐻 🐼 🐸 🦁 🐯 🐨 🐙 🦄 🐝 🐢 🦉 🐧 🦖 🐳 🦜 🐞 🦋 🍕 🍉 🌵 🚀 ⚡ 🌈 ⭐ 🎈 🎩 👑 🎲 🎸

### 5.7 Animations et célébration

**Principe : discret pendant la partie, festif à l'arrivée.**

- Validation d'un mot : le tampon se pose dans la case (léger zoom de 1.4 à 1, environ 300 ms). Aucun son, aucune vibration.
- Arrivée d'une équipe :
  - confettis aux couleurs de l'équipe et en Or du sceau, avec la bibliothèque `canvas-confetti`, environ 2 secondes ;
  - son court et joyeux (petite fanfare de 3 notes montantes), généré avec la Web Audio API pour éviter de gérer des fichiers audio ;
  - vibration courte avec `navigator.vibrate`. Attention : d'après ce que je sais, Safari sur iPhone ne prend pas en charge la vibration ; elle ne fonctionnera donc probablement que sur Android. À vérifier sur ton téléphone ;
  - bandeau « mission accomplie » (section 4.2).
- Bouton « Couper le son » dans le menu, réglage mémorisé.
- Respecter le réglage « Réduire les animations » du téléphone (`prefers-reduced-motion`) : dans ce cas, pas de confettis ni de zoom, juste le bandeau.

Remarque : sur iPhone, un son ne peut en général être joué qu'après une action de l'utilisateur. Comme la célébration se déclenche suite à l'appui sur « Réussi », cela devrait fonctionner, mais c'est à tester.

### 5.8 Ton des textes

- Tutoiement ? Non : l'application parle au maître du jeu de façon neutre et chaleureuse, sans pronom quand c'est possible (« Ajouter une équipe », « Lancer la partie »).
- Phrases courtes, verbes clairs, pas de jargon.
- Petites touches de vocabulaire diplomatique pour le jeu : délégation, passeport, tampon, mission accomplie. Sans en abuser.
- Les messages d'erreur disent quoi faire, sans s'excuser.

Exemples :
- Écran vide : « Aucune équipe pour l'instant. Ajoutez la première délégation ! »
- Validation : « Les Renards 🦊 passent au mot 5. »
- Arrivée : « 🦊 Les Renards : mission accomplie ! 1re place »

### 5.9 Accessibilité et confort

- Zones tactiles de 44 px minimum, 52 px pour « Réussi ».
- Le bouton « Réussi » est toujours à portée de pouce (bas de la carte).
- Contraste suffisant pour une lecture en extérieur.
- Contour visible au focus clavier.
- L'écran ne doit jamais défiler horizontalement.
- Respecter les zones sûres de l'iPhone (encoche, barre du bas) avec `env(safe-area-inset-*)`.
- Option bonus : empêcher la mise en veille de l'écran pendant la partie avec l'API Wake Lock (support variable selon les navigateurs, à tester).

## 6. Données et sauvegarde

### 6.1 Modèle de données (TypeScript)

```ts
export type Equipe = {
  id: string;            // identifiant unique, par exemple crypto.randomUUID()
  nom: string;
  couleur: string;       // hex, une des 20 couleurs, unique par équipe
  emoji: string | null;  // null = afficher l'initiale du nom
  indexMot: number;      // 0 = premier mot ; égal au nombre de mots = terminé
  arriveeA: number | null; // horodatage de l'arrivée, sert au classement
};

export type Partie = {
  version: 1;            // pour gérer les évolutions futures du format
  mots: string[];
  equipes: Equipe[];
  motsMasques: boolean;
  sonActif: boolean;
  ecran: "preparation" | "partie" | "classement";
};
```

Le classement se calcule à partir de `arriveeA` (tri croissant). On ne le stocke pas séparément, pour éviter les incohérences.

### 6.2 Sauvegarde

- Tout l'état est enregistré dans le `localStorage` du navigateur, sous la clé `l-ambassadeur:partie`, à chaque modification.
- Au démarrage, l'application recharge cette sauvegarde si elle existe.
- Toujours entourer la lecture et l'écriture d'un `try/catch` : si la sauvegarde est absente ou illisible, démarrer sur une partie vide.
- Limite à connaître : la partie n'existe que sur ce téléphone et dans ce navigateur. Effacer les données du navigateur ou utiliser la navigation privée fait tout perdre.

## 7. Stack technique

- **Vite** (outil de développement et de construction).
- **React** + **TypeScript**.
- **CSS simple** avec des variables CSS pour la palette (un fichier `src/styles/theme.css`). Pas de framework CSS : le projet est petit et la DA est spécifique.
- **canvas-confetti** pour les confettis.
- **@fontsource/fredoka** et **@fontsource/atkinson-hyperlegible** pour les polices.
- Pas de backend, pas de base de données, pas de routeur.

### Structure de dossiers proposée

```
l-ambassadeur/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ main.tsx              (point d'entrée)
│  ├─ App.tsx               (choisit l'écran à afficher)
│  ├─ types.ts              (types Equipe et Partie)
│  ├─ constantes.ts         (20 couleurs, liste d'emojis, clé de sauvegarde)
│  ├─ etat/
│  │  ├─ usePartie.ts       (état de la partie + actions : valider, annuler, etc.)
│  │  └─ sauvegarde.ts      (lecture et écriture localStorage)
│  ├─ ecrans/
│  │  ├─ Preparation.tsx
│  │  ├─ Partie.tsx
│  │  └─ Classement.tsx
│  ├─ composants/
│  │  ├─ CarteEquipe.tsx
│  │  ├─ Passeport.tsx      (rangée de cases et tampons)
│  │  ├─ PastilleEquipe.tsx
│  │  ├─ ChoixCouleurEmoji.tsx
│  │  ├─ MessageAnnuler.tsx (le message en bas avec « Annuler »)
│  │  ├─ BandeauArrivee.tsx
│  │  └─ Podium.tsx
│  ├─ celebration/
│  │  ├─ confettis.ts
│  │  └─ son.ts             (fanfare avec Web Audio API)
│  └─ styles/
│     ├─ theme.css          (variables : couleurs, polices, rayons)
│     └─ global.css
├─ CAHIER_DES_CHARGES.md    (ce document)
├─ index.html
├─ package.json
└─ tsconfig.json
```

Les noms en français sont un choix pour que tu t'y retrouves facilement. Si tu préfères l'anglais, dis-le à l'assistant dès le début.

## 8. Mise en route pas à pas (débutant)

Les commandes et menus ci-dessous correspondent à ce que je connais de ces outils. Les interfaces changent parfois : si un bouton n'a pas exactement le même nom, cherche l'équivalent.

### Étape 1 : installer les outils (une seule fois)
1. **Node.js** : télécharger la version « LTS » sur le site officiel nodejs.org et l'installer.
2. **VS Code** : télécharger sur code.visualstudio.com et l'installer.
3. **Git** : télécharger sur git-scm.com et l'installer (sur Mac, il est souvent déjà présent).
4. Créer un compte gratuit sur **GitHub** (github.com).
5. Créer un compte gratuit sur **Vercel** (vercel.com) en choisissant « Continuer avec GitHub ».

Vérification : ouvrir un terminal et taper `node -v` puis `git --version`. Chacune doit afficher un numéro de version.

### Étape 2 : créer le projet
Dans un terminal, dans le dossier où tu ranges tes projets :

```bash
npm create vite@latest l-ambassadeur -- --template react-ts
cd l-ambassadeur
npm install
npm install canvas-confetti @fontsource/fredoka @fontsource/atkinson-hyperlegible
npm install -D @types/canvas-confetti
code .
```

La dernière commande ouvre le projet dans VS Code (si elle ne marche pas, ouvre le dossier depuis VS Code avec Fichier > Ouvrir le dossier).

Copie ce document à la racine du projet sous le nom `CAHIER_DES_CHARGES.md`.

### Étape 3 : lancer l'application en local
Dans le terminal de VS Code (menu Terminal > Nouveau terminal) :

```bash
npm run dev
```

Ouvre l'adresse affichée (souvent `http://localhost:5173`). La page se met à jour toute seule à chaque modification.

Pour tester sur ton téléphone (connecté au même wifi) : `npm run dev -- --host`, puis ouvre sur le téléphone l'adresse « Network » affichée.

### Étape 4 : développer avec un assistant
Voir la section 9 pour l'ordre des étapes et les consignes à donner.

### Étape 5 : envoyer le code sur GitHub
1. Sur github.com, créer un nouveau dépôt nommé `l-ambassadeur`, sans README (le projet en a déjà un).
2. Dans le terminal du projet :

```bash
git init
git add .
git commit -m "Première version de L'Ambassadeur"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/l-ambassadeur.git
git push -u origin main
```

Remplace `TON-PSEUDO` par ton nom d'utilisateur GitHub. La première fois, Git te demandera de te connecter à GitHub.

Plus simple : VS Code a un bouton « Publier sur GitHub » dans l'onglet Contrôle de code source (icône de branches à gauche), qui fait tout cela pour toi.

### Étape 6 : mettre en ligne avec Vercel
1. Sur vercel.com, cliquer sur « Add New… » puis « Project ».
2. Choisir le dépôt `l-ambassadeur`.
3. Vercel devrait détecter « Vite » tout seul. Laisser les réglages par défaut (commande `npm run build`, dossier de sortie `dist`).
4. Cliquer sur « Deploy ». Après une minute environ, tu obtiens une adresse du type `l-ambassadeur.vercel.app`.

Ensuite, à chaque `git push`, Vercel remet l'application à jour automatiquement.

### Étape 7 : sur le téléphone
Ouvrir l'adresse Vercel, puis « Ajouter à l'écran d'accueil » (menu Partager sur iPhone, menu ⋮ sur Android) pour l'ouvrir comme une application.

## 9. Ordre de développement conseillé

Avancer étape par étape, et vérifier que tout marche avant de passer à la suivante. Faire un `git commit` à la fin de chaque étape : en cas de problème, on peut revenir en arrière.

1. **Thème** : `theme.css` avec les variables de couleurs, polices et rayons. Une page de test qui affiche boutons et cartes.
2. **Données** : `types.ts`, `constantes.ts`, `sauvegarde.ts`, `usePartie.ts` avec les actions : ajouter, modifier, supprimer une équipe ; définir les mots ; valider ; annuler ; nouvelle partie.
3. **Écran Préparation** sans le choix de couleur et d'emoji (couleurs automatiques).
4. **Écran Partie** : cartes, mot en cours, bouton Réussi, passeport simple (cases pleines ou vides).
5. **Annuler** : message en bas avec bouton Annuler, protection double appui.
6. **Arrivées et Classement** : section Arrivées, écran Classement, podium.
7. **Choix couleur et emoji** (panneau du bas).
8. **Célébration** : tampon animé, confettis, son, vibration, bouton couper le son.
9. **Finitions** : masquer les mots, logo, favicon, motif guilloché, test sur vrai téléphone.

### Consigne à donner à l'assistant au début
> Lis CAHIER_DES_CHARGES.md. Je suis débutant. Nous allons construire l'application étape par étape en suivant la section 9. Fais uniquement l'étape 1. Explique-moi simplement ce que tu crées et pourquoi, et dis-moi comment vérifier que ça fonctionne. Ne passe pas à l'étape suivante sans mon accord.

## 10. Vérifications avant de jouer en vrai

- [ ] Je crée 20 équipes : le bouton d'ajout se désactive et les 20 couleurs sont toutes différentes.
- [ ] Deux équipes avec le même nom : message d'erreur.
- [ ] « Réussi » fait avancer d'un seul mot, même si j'appuie deux fois très vite.
- [ ] « Annuler » ramène bien au mot précédent.
- [ ] La dernière validation déclenche confettis, son et bandeau, et l'équipe passe dans « Arrivées » avec le bon rang.
- [ ] Annuler une arrivée recalcule le classement.
- [ ] Je recharge la page en pleine partie : tout est conservé.
- [ ] Les mots masqués ne sont visibles que quand je touche « Mot caché ».
- [ ] Le son coupé reste coupé après rechargement.
- [ ] Sur mon téléphone, rien ne déborde sur les côtés et les boutons sont faciles à toucher.
- [ ] Une partie complète avec 3 équipes et 5 mots fonctionne de bout en bout.

## 11. Idées pour plus tard

- Bibliothèque de listes de mots réutilisables.
- Chronomètre global et temps par équipe.
- Export du classement en image à partager.
- Mode hors ligne installable (PWA).
- Écran « spectateurs » à projeter, synchronisé avec le téléphone du maître du jeu (nécessiterait un petit serveur).
