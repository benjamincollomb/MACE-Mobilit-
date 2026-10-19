# MACE Mobilité — site officiel + direction

Site statique compatible **GitHub Pages**, avec **Firebase Authentication + Cloud Firestore** pour les données et l'accès à la direction.

## 1. Publier gratuitement sur GitHub Pages

1. Créer un dépôt GitHub public `mace-mobilite`.
2. Ajouter à la racine `index.html`, `styles.css`, `app.js`, `firebase-config.js`, `firestore.rules`, `.nojekyll` et `README.md`.
3. Aller dans **Settings > Pages > Build and deployment** : **Deploy from a branch**, branche `main`, dossier `/ (root)` puis **Save**.
4. Ouvrir `https://VOTRE-PSEUDO.github.io/mace-mobilite/` une fois le déploiement terminé.

Avant de connecter Firebase, le site fonctionne en **mode démonstration**. Les exemples sont fictifs et conservés dans le stockage local du navigateur. N'utilisez pas ce mode pour vos données sensibles : l'espace de direction n'est alors pas protégé.

## 2. Créer le projet Google Firebase (forfait Spark gratuit)

1. Ouvrir https://console.firebase.google.com/ puis créer le projet `mace-mobilite`.
2. Dans **Build > Authentication > Sign-in method**, activer **Email/Password**.
3. Dans **Authentication > Users**, ajouter votre compte administrateur (e-mail/mot de passe). Aucun formulaire d'inscription public n'est prévu.
4. Copier **l'UID** de cet utilisateur (colonne UID).
5. Dans **Build > Firestore Database**, créer la base (choisir une région). Dans l'onglet **Rules**, coller `firestore.rules`, **remplacer `REMPLACER_PAR_VOTRE_UID` par l'UID exact**, et publier les règles.
6. Dans **Project settings > General > Your apps**, ajouter une application **Web**. Copier les champs de `firebaseConfig` dans `firebase-config.js`.
7. Dans **Authentication > Settings > Authorized domains**, ajouter `VOTRE-PSEUDO.github.io` si ce domaine ne figure pas dans la liste.
8. Re-publier les fichiers sur GitHub, puis ouvrir le site. Cliquer **Espace direction** et se connecter.

**Important :** La configuration Web Firebase (apiKey, projectId, etc.) peut figurer dans un site public ; les règles Firestore sont la véritable barrière de sécurité. Ne publiez jamais de clé de compte de service / private key. Ne mettez pas `allow read, write: if true`. Il faut **publier les règles avant** de commencer à utiliser des données confidentielles.

## 3. Fonctionnement des données

Collections Firestore sous `company/mace-mobilite/` :

- `vehicles` : public en lecture ; admin en écriture.
- `lines` : public en lecture ; admin en écriture.
- `news` : public en lecture ; admin en écriture.
- `staff` : admin uniquement.
- `finance` : admin uniquement.

Le tableau de bord calcule le solde à partir de toutes les opérations enregistrées. L'export JSON est possible depuis le menu direction. Le contenu initial apparaît **seulement en démonstration** : la base Firestore fraîchement créée sera vide, à remplir avec les vraies données du jeu.

## 4. Limites et personnalisation

- Le site ne se synchronise **pas automatiquement avec Transport Manager**. Renseignez vos données depuis l'espace direction.
- Le site ne possède pas encore de gestion des rôles multi-administrateurs ni de restauration par import JSON.
- Les liens publics et le nom de domaine `github.io` sont gratuits dans les limites des offres concernées. Firebase Spark reste soumis à des quotas ; surveillez-les dans la console.
- Pour remplacer le logo par votre logo MACE Mobilité d'origine, ajoutez l'image à votre dépôt et ajustez l'en-tête dans `index.html`.
- Préférer HTTPS (GitHub Pages le fournit). Prévoir des sauvegardes régulières.

## 5. Développement local

Le site utilise des modules ES et doit être ouvert depuis un serveur HTTP local, pas via `file://`.

```bash
python3 -m http.server 8000
```

Ouvrir http://localhost:8000/.


## Logo officiel – correctif

Le logo utilise l'URL publique Fivemanage fournie par le propriétaire, avec une copie de secours dans `assets/mace-logo.png`.
Pour GitHub Pages, **envoyez les fichiers à la racine du dépôt**, et non le dossier `mace-mobilite` lui-même.
La structure attendue est `index.html`, `styles.css`, `app.js`, `firebase-config.js` et `assets/mace-logo.png`.
Si la mise à jour n'apparaît pas, attendez le déploiement GitHub Pages puis forcez l'actualisation (Ctrl+F5).
