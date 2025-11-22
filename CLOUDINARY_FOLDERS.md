# 📂 Dynamic Folder Mode - Guide Détaillé

Cette application utilise exclusivement le **Dynamic Folder Mode** de Cloudinary pour une meilleure flexibilité et organisation.

## 🔍 Les Deux Modes

Cloudinary propose deux modes de gestion des dossiers selon la date de création de votre compte. Voir la [documentation officielle](https://cloudinary.com/documentation/folder_modes) pour plus de détails.

### 1️⃣ Fixed Folder Mode (Mode Traditionnel)

**Utilisé par** : Comptes créés avant ~2023

**Fonctionnement** :

- Le `public_id` de l'asset contient le chemin complet du dossier
- Exemple : `escoffier-nov-2025/photo123.jpg`
- Le dossier fait partie intégrante de l'identifiant de l'asset
- Déplacer un asset = changer son `public_id`

**Avantages** :

- Simple et prévisible
- Le chemin du fichier est dans son ID
- Compatible avec les anciennes intégrations

**Inconvénients** :

- Moins flexible pour réorganiser les assets
- Déplacer un asset casse les URLs existantes

### 2️⃣ Dynamic Folder Mode (Mode Moderne)

**Utilisé par** : Comptes créés après ~2023

**Fonctionnement** :

- Le `public_id` et l'`asset_folder` sont séparés
- Un asset a aussi un `display_name` distinct du `public_id`
- Exemple : `public_id: xyz123`, `asset_folder: escoffier-nov-2025`, `display_name: photo-mariage.jpg`
- Déplacer un asset entre dossiers ne change pas son `public_id`

**Avantages** :

- Très flexible : réorganisez sans casser les URLs
- Meilleure expérience dans le Media Library
- Noms d'affichage lisibles séparés des IDs techniques

**Inconvénients** :

- Légèrement plus complexe à comprendre
- Nécessite de comprendre la distinction public_id / asset_folder

## ✅ Notre Implémentation : Dynamic Folder Mode

### Ce que nous utilisons

Dans notre code (`app/api/upload/route.ts`), nous utilisons les paramètres optimisés pour le Dynamic mode :

```typescript
cloudinary.uploader.upload_stream({
  resource_type: type === "video" ? "video" : "image",
  asset_folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "escoffier-event",
  use_filename_as_display_name: true,
  unique_filename: true,
  use_asset_folder_as_public_id_prefix: true,
  ...
})
```

### Avantages de cette configuration

**`asset_folder`** :

- Place les assets dans le bon dossier du Media Library
- Séparé du `public_id` pour plus de flexibilité
- Vous pouvez déplacer les assets entre dossiers sans casser les URLs

**`use_filename_as_display_name: true`** :

- Le nom original du fichier devient le `display_name`
- Plus facile à retrouver dans le Media Library
- Noms lisibles au lieu d'IDs cryptiques

**`use_asset_folder_as_public_id_prefix: true`** :

- Le `public_id` commence par le nom du dossier
- Structure claire : `escoffier-nov-2025/abc123`
- Cohérence entre l'organisation et les IDs

**`unique_filename: true`** :

- Génère des IDs uniques automatiquement
- Évite les conflits de noms
- Pas besoin de gérer les doublons manuellement

## 🔧 Vérifier que Vous Êtes en Dynamic Mode

### Méthode 1 : Via l'Interface Cloudinary

1. Connectez-vous à votre Dashboard Cloudinary
2. Allez dans **Settings** > **Product Environment Settings**
3. Regardez la section **Folder Mode**
4. Doit indiquer **"Dynamic"** ou **"Dynamic Folder Mode"**

### Méthode 2 : En Testant

1. Uploadez une image test avec notre application
2. Allez dans le Media Library de Cloudinary
3. Regardez les détails de l'asset :
   - ✅ Vous voyez `asset_folder`, `display_name` et `public_id` séparés → Dynamic mode
   - ❌ Seulement `public_id` avec le chemin → Fixed mode (incompatible)

### Si Vous Êtes en Fixed Mode

**Comptes récents (depuis 2023)** : Automatiquement en Dynamic mode ✅

**Comptes anciens** : Vous devez demander la migration :

1. Contactez le [support Cloudinary](https://support.cloudinary.com)
2. Demandez la migration vers Dynamic Folder Mode
3. C'est gratuit et généralement fait en 24-48h
4. Aucun impact sur vos assets existants

## 🎯 Utilisation Optimale du Dynamic Mode

### Organisation dans le Media Library

**Dossiers par événement** :

```
escoffier-nov-2025/
├── photo-invites-001.jpg (display_name)
├── video-discours.mp4
└── ...

escoffier-dec-2025/
├── ...
```

**Avantages** :

- 📁 **Réorganisation flexible** : Déplacez les assets entre dossiers sans casser les URLs
- 📝 **Noms lisibles** : `photo-invites-001.jpg` au lieu de `xyz123abc`
- 🔍 **Recherche facilitée** : Cherchez par nom de fichier ou par dossier
- 🎨 **Interface intuitive** : Le Media Library Cloudinary est optimisé pour ce mode

### Bonnes Pratiques

1. **Nommage des événements** :

   - Format : `escoffier-MOIS-ANNEE`
   - Exemple : `escoffier-jan-2026`, `escoffier-fev-2026`
   - Cohérent et facile à retrouver

2. **Demandez aux invités de nommer leurs fichiers** :

   - Au lieu de `IMG_1234.jpg`
   - Préférez `photo-entree-jean.jpg`
   - Le `display_name` sera plus explicite

3. **Archivage** :
   - Téléchargez le dossier complet après l'événement
   - Supprimez-le de Cloudinary pour libérer l'espace
   - Les noms de fichiers téléchargés seront les `display_name` (lisibles)

## 📚 Détails Techniques de Notre Implémentation

### Upload API (app/api/upload/route.ts)

```typescript
cloudinary.uploader.upload_stream({
  resource_type: type === "video" ? "video" : "image",

  // Dossier dans le Media Library
  asset_folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,

  // Utilise le nom du fichier comme display_name
  use_filename_as_display_name: true,

  // Génère un public_id unique
  unique_filename: true,

  // Préfixe le public_id avec le dossier
  use_asset_folder_as_public_id_prefix: true,

  // Optimisations vidéo
  ...(type === "video" && {
    transformation: [{ quality: "auto:low", fetch_format: "auto" }],
  }),
});
```

### Admin API (app/api/media/route.ts)

```typescript
// Récupérer tous les assets d'un asset_folder
const images = await cloudinary.api.resources_by_asset_folder(assetFolder, {
  resource_type: "image",
  max_results: 500,
});

const videos = await cloudinary.api.resources_by_asset_folder(assetFolder, {
  resource_type: "video",
  max_results: 500,
});
```

### Résultat

Chaque asset aura :

- **public_id** : `escoffier-nov-2025/abc123xyz` (ID unique stable)
- **asset_folder** : `escoffier-nov-2025` (pour l'organisation)
- **display_name** : `photo-soiree-gala.jpg` (nom lisible)
- **secure_url** : L'URL pour afficher l'asset

## 🆘 Dépannage

### "Mes assets ne s'affichent pas dans la galerie"

**Vérifiez** :

1. Que `CLOUDINARY_FOLDER` dans `.env.local` correspond au dossier réel
2. Que les assets sont bien dans ce dossier dans le Media Library Cloudinary
3. En Dynamic mode, vérifiez que le `public_id` commence par le nom du dossier

### "Je ne trouve pas mes assets dans Cloudinary"

**Solution** :

1. Allez dans le Media Library
2. Utilisez la recherche en haut : tapez le nom de votre dossier
3. En Dynamic mode, utilisez les filtres par `asset_folder`
4. En Fixed mode, cherchez par préfixe de `public_id`

### "Je veux changer de dossier ou réorganiser"

**Pour un nouvel événement** :

- Changez `CLOUDINARY_FOLDER` dans `.env.local` et Vercel
- Exemple : `CLOUDINARY_FOLDER=escoffier-jan-2026`

**Pour réorganiser les assets existants** :

- Utilisez le Media Library Cloudinary
- Glissez-déposez les assets entre dossiers
- Les URLs restent valides ! (avantage du Dynamic mode)

## 💡 Conclusion

**Pour votre cas d'usage (association bénévole, 1 événement/mois)** :

✅ **Configuration requise : Dynamic Folder Mode**

- Vérifiez que votre compte Cloudinary est en Dynamic mode
- Si non, demandez la migration (gratuit, rapide)
- Profitez d'une meilleure organisation et flexibilité
- Les noms de fichiers sont lisibles dans le Media Library
- Réorganisez les dossiers sans casser les URLs

**Workflow simple** :

1. Créez `CLOUDINARY_FOLDER=escoffier-MOIS-ANNEE`
2. Les invités uploadent (noms de fichiers préservés)
3. Organisez dans le Media Library si besoin
4. Téléchargez le dossier après l'événement
5. Supprimez pour libérer l'espace

Le Dynamic Folder Mode rend tout plus intuitif et flexible ! 🎉

## 📞 Ressources

- [Documentation Cloudinary - Folder Modes](https://cloudinary.com/documentation/folder_modes)
- [Admin API - Resources](https://cloudinary.com/documentation/admin_api#resources)
- [Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
