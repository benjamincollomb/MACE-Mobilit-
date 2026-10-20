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

## Fiche détaillée des bus (mise à jour)
Dans **Direction → Véhicules → Ajouter / Modifier**, les champs supplémentaires sont : motorisation, immatriculation, mise en service, kilométrage, dernière révision et prochain contrôle technique. Les champs sont facultatifs pour ne pas bloquer les véhicules existants.

Les visiteurs ouvrent une fiche en cliquant sur **Voir la fiche du véhicule** dans la section Flotte ; la direction peut aussi cliquer sur **Fiche** dans son tableau. Les fiches affichent « Non renseigné » pour les anciennes données absentes.

Les nouveaux champs sont enregistrés dans le même document Firestore `company/mace-mobilite/vehicles/{id}` : aucune nouvelle collection ni modification des règles Firestore n'est nécessaire. La saisie est manuelle : il n'existe pas de synchronisation automatique avec Transport Manager.

### Statuts véhicules

Les véhicules peuvent être marqués **En service**, **Disponible**, **Indisponible**, **Non immatriculé** ou **En maintenance**. Ces valeurs sont sauvegardées dans le champ `status` existant de Firestore et ne nécessitent pas de migration.

## V3 — nouveaux modules
- Journal : cartes avec extraits, clic sur « Lire l’article » pour voir un article entier, avec paragraphes séparés par des lignes vides.
- Personnel : champ Statut (En service, En vacances, Malade, En congé, En repos, En formation, Indisponible, En attente d’affectation). Ces statuts privés ne sont pas exposés aux visiteurs.
- Tarifs : collection Firestore `company/mace-mobilite/tickets` ; gestion des billets depuis l'espace direction.
- Histoire : collection `company/mace-mobilite/history` ; possibilité de créer des entrées chronologiques.
- Équipe publique : collection `company/mace-mobilite/team` ; membres publiés volontairement, séparés de `staff` (salaires et absences privés).
- Les fenêtres de lecture et d’édition sont désormais défilables à l’intérieur de l’écran.

### Obligatoire : publier les nouvelles règles Firestore
Le fichier `firestore.rules` dans le ZIP autorise la consultation publique des collections `tickets`, `history` et `team`, mais seules les personnes dont l’UID correspond à celui renseigné peuvent modifier les données. Pour activer ces 3 nouvelles rubriques, copier **le contenu entier** de `firestore.rules` dans Firebase Console > Firestore Database > Règles puis cliquer sur **Publier**. Un dépôt GitHub ne publie pas automatiquement ces règles. Ne jamais publier de salaires, de données personnelles privées ou de statuts d'absence dans la collection `team`.

### Mise à jour sans perdre les données
Remplacer tous les fichiers à la racine du dépôt GitHub Pages. Les collections existantes ne sont ni effacées ni renommées. Les nouveaux champs des employés apparaîtront progressivement au fil des modifications.


## V4 — Finances et prêts

- Dans **Direction → Finances**, recherche libre, filtres par catégorie, type et année, montants des recettes en vert et dépenses en rouge. Les KPIs sont calculés sur les écritures filtrées.
- Dans **Direction → Prêts et remboursements**, crée une fiche avec prêteur, référence, capital prévu, taux annuel et date.
- Pour constater l'argent réellement reçu, ajoute dans **Finances** une opération de type **Recette**, catégorie **Prêt**, puis sélectionne le prêt correspondant. Chaque écriture augmente son « capital emprunté (encaissé) ».
- Pour suivre une échéance, ajoute une opération de type **Dépense**, catégorie **Remboursement de prêt**, et sélectionne le même prêt. Le tableau affiche alors le remboursement cumulé et le solde restant.
- Le **total à rembourser estimatif** utilise un **intérêt forfaitaire d'une année** : capital encaissé × (1 + taux annuel / 100). Ce n'est **pas** un amortissement bancaire précis : les échéances, les dates, la capitalisation des intérêts et les frais ne sont pas pris en compte.
- Les versements d'emprunt et les remboursements sont exclus du résultat d'exploitation, mais pris en compte dans le flux de trésorerie (simplifié).
- Les fiches de prêts sont enregistrées dans la collection privée `company/mace-mobilite/loans`. Les règles Firestore déjà fournies (accès admin uniquement aux collections non publiques) fonctionnent sans ajout de lecture publique.
- Sauvegardez les fichiers à la racine du dépôt GitHub et veillez à conserver votre configuration Firebase.

## Photos hébergées sur FiveManage (V5)
Dans **Espace direction → Véhicules** ou **Équipe publique**, utilisez le champ **URL de la photo (FiveManage)**. Collez un lien HTTPS direct vers un JPG, PNG ou WebP. L'image est chargée depuis FiveManage côté visiteur ; seul le texte de son URL est enregistré dans Firestore. Les champs peuvent rester vides. Il n'est pas nécessaire de modifier les règles Firestore. Les images doivent être publiques et accessibles sans connexion.


## Correctif V6 — Prêts et remboursements
Dans Finances, choisir la catégorie **Prêt** ou **Remboursement de prêt** affiche maintenant un menu obligatoire **Prêt associé**. Pour recevoir un emprunt, commencer par créer une fiche dans l'onglet Prêts, puis ajouter une recette catégorie Prêt liée à cette fiche. Pour rembourser, cliquer sur **Saisir remboursement** dans la fiche de prêt : le prêt, la catégorie et le type sont préremplis. L'ajout ou la suppression d'une opération met les chiffres du prêt à jour après la synchronisation Firestore. Si aucun prêt n'apparaît dans le menu, en créer un d'abord.


## V8.1 — correction du chargement
Le JavaScript est désormais distribué dans `app-v8.js` (au lieu de `app.js`),
pour éviter qu'une ancienne version de `app.js` en cache masque les dernières corrections.
Supprimez l'ancien `app.js` du dépôt lors de la mise à jour, puis vérifiez la présence
de la mention « MACE Mobilité · V8.1 » en bas à gauche du site.


## Version 10 — Durée des prêts
Dans Direction → Prêts → Ajouter/Modifier, remplir la **Durée du prêt (en mois)**, par exemple 60 pour cinq ans. Le tableau affiche la durée, la mensualité indicative, les intérêts totaux estimés et la date de fin calculée à partir de la date de souscription. L'estimation utilise un taux nominal annuel et des mensualités constantes, **sans** frais d'assurance ni frais bancaires. La somme réellement encaissée depuis Finances (catégorie Prêt) sert de base aux calculs ; les remboursements enregistrés diminuent le montant estimé restant. Les prêts existants restent compatibles : compléter leur durée pour passer au nouveau calcul. Aucun changement aux règles Firebase requis.
