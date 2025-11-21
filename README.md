# 📸 Escoffier Gallery - Application de Partage Photos & Vidéos

Application web pour partager les photos et vidéos des événements de l'association **Disciples Escoffier Provence Méditerranée**.

## ✨ Fonctionnalités

- 📤 **Upload de médias** : Photos et vidéos (séparés)
- 🖼️ **Galerie** : Affichage organisé avec onglets Photos/Vidéos
- ☁️ **Stockage Cloud** : Cloudinary (gratuit, 25 GB)
- 🚀 **Déploiement** : Vercel (gratuit)
- 📱 **Responsive** : Design moderne et mobile-first
- 🎨 **Design** : Inspiré de la charte graphique Escoffier

## 🎯 Cas d'usage

- **Public** : ~200 invités par événement
- **Fréquence** : 1 événement par mois
- **Durée** : Site actif pendant 1 mois par événement
- **Coût** : 100% gratuit

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=escoffier-nov-2025
```

📖 **Voir [SETUP.md](./SETUP.md) pour les instructions détaillées**

### 3. Lancement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
/app
  /api
    /upload       # Route API pour upload vers Cloudinary
    /media        # Route API pour récupérer les médias
  /upload         # Page d'upload
  /gallery        # Page galerie
  page.tsx        # Page d'accueil
/components
  HomeComponent.tsx
/public
  logo-escoffier.png
```

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Stockage** : Cloudinary (Dynamic Folder Mode)
- **Hosting** : Vercel

## ⚠️ Contraintes Importantes

### Cloudinary (Gratuit)

- **Mode requis** : Dynamic Folder Mode (comptes récents depuis 2023)
- **Stockage** : 25 GB
- **Bande passante** : 25 GB/mois
- Suffisant pour ~2000 photos par événement

### Vercel (Gratuit)

- Body size max : **4.5 MB** par requête
- Function execution : **10 secondes** max
- Solution : Upload fichier par fichier

## 📝 Workflow Événementiel

1. **Avant** : Mise à jour du `CLOUDINARY_FOLDER`
2. **Pendant** : Les invités uploadent (1 mois)
3. **Après** :
   - Télécharger tous les médias depuis Cloudinary
   - Supprimer le dossier Cloudinary
   - Archiver localement

## 🎨 Pages

### `/` - Accueil

Présentation de l'événement avec navigation

### `/upload` - Upload

- Sélection Photos ou Vidéos
- Upload multiple
- Feedback en temps réel

### `/gallery` - Galerie

- Onglets Photos / Vidéos
- Grille responsive
- Modal pour agrandissement

## 📖 Documentation Complète

- **[SETUP.md](./SETUP.md)** - Configuration détaillée et optimisations
- **[CLOUDINARY_BACKUP.md](./CLOUDINARY_BACKUP.md)** - Sauvegarde des médias
- **[CLOUDINARY_FOLDERS.md](./CLOUDINARY_FOLDERS.md)** - Dynamic Folder Mode expliqué

## 🤝 Contribution

Projet développé pour l'association **Disciples Escoffier Provence Méditerranée**.

## 📄 Licence

Projet privé - Usage interne association
