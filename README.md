# Xalam — La musique sénégalaise

Projet JavaScript L3 CPD · ISM 2026-2027 · Alioune B. Gueye

Xalam est une application web pour découvrir la musique sénégalaise par genre (mbalax, rap galsen, afro-jazz…), par région et par artiste. Elle a un lecteur audio complet, des titres aimés et des playlists personnelles.

- **Maquette Figma :** https://www.figma.com/design/a1Kr1sMjxfJ6mSdArLriUx
- **Technologies :** HTML5, CSS3, JavaScript, sans framework ni librairie

---

## Structure du projet

```
xalam/
├── index.html        → structure de la page (connexion/inscription, sidebar, barre du haut, lecteur, fenêtres)
├── css/style.css     → design (couleurs, typos, composants) + responsive
├── js/data.js        → données : artistes, titres, genres, playlists par défaut
├── js/app.js         → toute la logique (navigation, affichage, lecteur audio)
├── audio/            → 6 extraits MP3 de démo (45 s, libres de droits)
├── vercel.json       → en-têtes de sécurité (CSP, anti-iframe…) et cache des images/audio
└── images/
    ├── logo.svg      → logo Xalam
    ├── artistes/     → 10 photos d'artistes (600 × 600 px)
    └── pochettes/    → 11 pochettes d'albums et de singles (600 × 600 px)
```

## Fonctionnalités

| Fonction | Où |
|---|---|
| Inscription et connexion (validation des champs, afficher/masquer le mot de passe, « se souvenir de moi », déconnexion) | Pages Connexion / Inscription, menu du profil |
| Données propres à chaque compte (likes, playlists, abonnements) et genres préférés mis en avant sur l'accueil | `localStorage` |
| Navigation entre 5 sections sans recharger la page | Accueil, Explorer, Genre, Artiste, Bibliothèque/Playlists, Recherche |
| Lecteur audio : lecture/pause, précédent/suivant, barre de progression, volume, couper le son | Barre du bas (desktop), mini-lecteur (mobile) |
| Lecture aléatoire et répétition (désactivée → toute la file → un titre) | Lecteur |
| Lecteur plein écran avec la file « À suivre » | Clic sur le titre en cours |
| Aimer un titre ♡ → liste « Titres aimés » | Partout |
| Créer, remplir, vider et supprimer des playlists | Bouton ••• d'un titre, page Playlists |
| Suivre un artiste → onglet « Artistes suivis » | Page artiste |
| Recherche en direct (titres, artistes, genres), sans tenir compte des accents | Barre de recherche |
| Filtres par genre (accueil) et par région (Explorer) | Chips |
| Sauvegarde automatique (likes, playlists, abonnements, volume) | `localStorage` |
| Raccourcis clavier : Espace = lecture/pause, ← → = reculer/avancer de 5 s, Échap = fermer | Clavier |
| Responsive : version ordinateur (sidebar) et version mobile (barre d'onglets) | En dessous de 900 px |

## Comment fonctionne le code (pour l'oral)

### 1. Les données sont séparées de l'affichage (`data.js`)
Tous les artistes, titres et genres sont dans des **tableaux d'objets** (`ARTISTS`, `TRACKS`, `GENRES`). Chaque titre a un `id`, un `title`, l'`id` de son artiste et le chemin de son fichier audio (`src`). Pour ajouter un titre, il suffit d'ajouter un objet : l'interface se met à jour toute seule.

### 2. La navigation : un « routeur » basé sur le `#` de l'URL
L'appli est une **SPA** (Single Page Application) : il n'y a qu'un seul `index.html`. Quand on clique sur un lien comme `#/artiste/youssou`, l'événement `hashchange` se déclenche. La fonction `render()` lit l'adresse avec `parseRoute()`, choisit la bonne vue (`viewArtist("youssou")`) et injecte le HTML dans `<div id="view">`. Le bouton « retour » du navigateur fonctionne donc normalement.

### 3. Les vues sont générées avec des template strings
Chaque page est une fonction qui **retourne du HTML** construit avec des template literals (`` `...${variable}...` ``). Les éléments qui se répètent sont des petites fonctions réutilisables (des « composants ») : `trackRow()` pour une ligne de titre, `artistCard()`, `coverHTML()`… Le texte est passé dans la fonction `esc()` pour éviter d'injecter du HTML par erreur.

### 4. Un seul écouteur de clics (délégation d'événements)
Au lieu de mettre un `addEventListener` sur chaque bouton (qui disparaît à chaque changement de page), on écoute **tous les clics sur `document`**. On regarde ensuite les attributs `data-*` de l'élément cliqué : `data-like="t1"` pour aimer le titre t1, `data-more` pour ouvrir le menu, `data-follow` pour suivre un artiste…

### 5. Le lecteur audio
On utilise **un seul élément `<audio>`** et l'objet `player` :
- `queue` : la liste des titres à jouer (la liste sur laquelle on a cliqué) ;
- `index` : la position du titre en cours ;
- `shuffle`, `repeat` : les modes de lecture ;
- `history` : pour que « précédent » fonctionne aussi en mode aléatoire.

Les événements de l'élément audio mettent l'interface à jour :
- `timeupdate` met à jour la barre de progression et le temps ;
- `play` et `pause` changent l'icône du bouton ;
- `ended` passe au titre suivant (ou rejoue le même en mode répéter un titre).

Les barres de progression sont des `<input type="range">` stylisées. La partie colorée vient d'une variable CSS `--val` mise à jour en JavaScript.

### 6. La sauvegarde
Les likes, playlists, abonnements et le volume sont enregistrés en **JSON dans le `localStorage`** à chaque modification (`saveStore()`). Ils sont relus au démarrage (`loadStore()`). Tout est dans un `try/catch` : si le stockage est bloqué, l'appli continue de fonctionner sans sauvegarde.

### 7. Les comptes (connexion / inscription)
- **Inscription :** `handleSignup()` vérifie chaque champ (nom, format de l'e-mail avec une expression régulière, mot de passe de 8 caractères minimum, conditions acceptées) et affiche l'erreur sous le bon champ. Le mot de passe n'est **jamais enregistré en clair** : on stocke son empreinte **SHA-256**, calculée avec l'API `crypto.subtle` du navigateur.
- **Connexion :** `handleLogin()` recalcule l'empreinte du mot de passe saisi et la compare à celle enregistrée.
- **Session :** avec « Se souvenir de moi », la session est dans `localStorage` (elle reste après fermeture du navigateur). Sinon, elle est dans `sessionStorage` (effacée à la fermeture de l'onglet).
- **Pages protégées :** au début de `render()`, si personne n'est connecté, on redirige vers `#/connexion`.
- ⚠️ **Limite assumée :** c'est une démo sans serveur. Les comptes n'existent que dans le navigateur où ils ont été créés. Une vraie appli aurait un back-end (Node.js, Firebase, Supabase…) pour stocker les comptes de façon sécurisée.

### 8. Le design
Les couleurs de la maquette sont des **variables CSS** (`--ocre`, `--or`, `--vert`…). Les pochettes et les avatars ne sont pas des images : ce sont des **dégradés CSS** avec un motif losange en SVG, inspiré du wax. Le responsive utilise des `@media (max-width: 900px)` : la sidebar disparaît, la barre d'onglets et le mini-lecteur apparaissent.

## Personnaliser

- **Photos et pochettes :** les photos sont dans `images/artistes/` (champ `photo` de chaque artiste dans `js/data.js`). Pour ajouter une pochette, mets l'image dans `images/pochettes/` puis ajoute `cover: "images/pochettes/nom.jpg"` au titre concerné. Sans image, un dégradé à motif wax s'affiche automatiquement.
- **Changer les musiques :** les fichiers de `audio/` sont des extraits de démo **composés par code et libres de droits** (sabar, rap, afro-jazz, kora, flûte peule). Les vrais titres des artistes sont protégés par le droit d'auteur. Pour d'autres sons, prends des MP3 libres de droits (Pixabay Music, Free Music Archive), mets-les dans `audio/` et modifie `src` dans `TRACKS`. Les durées s'adaptent toutes seules.

## Tester en local

Ouvre un terminal dans le dossier puis lance :
```
npx serve .
```
ou `python -m http.server`. Ouvre ensuite l'adresse indiquée. On peut aussi utiliser l'extension « Live Server » de VS Code.

## Déployer sur Vercel

**Option A, sans terminal :**
1. Crée un dépôt sur GitHub (ex. `xalam`) et envoie-y tous les fichiers (*Add file → Upload files*).
2. Sur https://vercel.com, connecte-toi avec GitHub, puis *Add New → Project* et choisis le dépôt `xalam`.
3. Laisse *Framework Preset* sur **Other** (pas de commande de build), puis clique sur **Deploy**.
4. Copie le lien `https://xalam-….vercel.app` dans le Google Sheets du cours.

**Option B, avec le terminal :** dans le dossier, lance `npx vercel`, puis `npx vercel --prod`.

## Crédits images

Les photos d'artistes et les pochettes d'albums appartiennent à leurs auteurs respectifs. Elles sont utilisées uniquement dans le cadre de ce projet pédagogique, sans usage commercial.

Sources : *à compléter (un lien par image)*.
