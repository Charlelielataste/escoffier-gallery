# Configuration de l'Application Escoffier Gallery

## 🎯 Vue d'ensemble

Application de partage de photos et vidéos pour les événements de l'association.

- **Utilisation** : événements bénévoles
- **Coût** : 100% gratuit (Cloudinary + Vercel gratuits)

## 📋 Prérequis

1. Un compte Cloudinary gratuit : https://cloudinary.com/users/register_free
2. Un compte Vercel gratuit : https://vercel.com/signup

## 🔧 Configuration Cloudinary

### Étape 1 : Créer un compte Cloudinary

1. Allez sur https://cloudinary.com
2. Créez un compte gratuit
3. Une fois connecté, accédez à votre Dashboard

**📂 Important - Dynamic Folder Mode** : Cette application utilise le **Dynamic Folder Mode** de Cloudinary ([documentation](https://cloudinary.com/documentation/folder_modes)). Les comptes Cloudinary créés récemment (depuis ~2023) sont automatiquement en mode dynamique. Si vous avez un ancien compte en Fixed mode, vous devrez peut-être [demander à Cloudinary](https://support.cloudinary.com) de migrer votre compte vers le Dynamic mode.

### Étape 2 : Récupérer vos credentials

Dans le Dashboard Cloudinary, vous trouverez :

- **Cloud Name** : `your_cloud_name`
- **API Key** : `your_api_key`
- **API Secret** : `your_api_secret`

### Étape 3 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_FOLDER=escoffier-nov-2025
```

⚠️ **Important** :

- Changez `CLOUDINARY_FOLDER` pour chaque nouvel événement (ex: `escoffier-dec-2025`)
- Le nom du dossier peut contenir uniquement des lettres, chiffres, tirets (-) et underscores (\_)
- Évitez les espaces et caractères spéciaux

## 🚀 Déploiement sur Vercel

### Configuration Vercel

1. Poussez votre code sur GitHub
2. Importez le projet dans Vercel
3. Ajoutez les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_FOLDER`

### ⚠️ Limites Vercel (Pack Gratuit)

- **Body size** : 4.5 MB max par requête
- **Function execution** : 10 secondes max
- **Bandwidth** : 100 GB/mois

**Solution** : Les fichiers sont uploadés un par un pour respecter la limite de 4.5 MB

## 📦 Limites Cloudinary (Pack Gratuit)

- **Stockage** : 25 GB
- **Bande passante** : 25 GB/mois
- **Transformations** : 25 crédits/mois

## 🛠️ Développement local

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev

# Build de production
npm run build

# Lancement en production
npm start
```

## 📱 Fonctionnalités

### Page d'accueil (`/`)

- Présentation de l'événement
- Navigation vers Upload et Galerie

### Page Upload (`/upload`)

- Sélection Photos ou Vidéos
- Upload multiple
- Limite : 4 MB par fichier pour Vercel gratuit

### Page Galerie (`/gallery`)

- Onglets Photos / Vidéos séparés
- Affichage en grille
- Modal pour agrandir les photos
- Lecteur vidéo intégré

## 🎨 Design

- Couleurs : basées sur le logo Escoffier
- Responsive : mobile-first
- Moderne : glassmorphism, shadows, transitions

## ⚡ Optimisations

- Images servies directement par Cloudinary (pas d'optimisation Vercel)
- Upload séquentiel pour respecter les limites
- Chargement lazy des médias
- Qualité auto pour les vidéos

### 📝 Comment ça fonctionne

Quand vous uploadez un fichier :

- Il est placé dans l'`asset_folder` défini par `CLOUDINARY_FOLDER`
- Le nom original devient le `display_name` (visible dans l'interface)
- Un `public_id` unique est généré automatiquement
- Vous pouvez réorganiser les dossiers sans problème

## 🔒 Sécurité

- API Keys en variables d'environnement
- Pas d'authentification (événement privé, URL partagée)
- Rate limiting géré par Cloudinary

## 📝 Notes importantes

1. **Fichiers volumineux** : Demandez aux invités de privilégier plusieurs petits uploads
2. **Vidéos** : Limitées à 4 MB sur Vercel gratuit (ou passer à Vercel Pro)
3. **Nettoyage** : N'oubliez pas de supprimer les médias Cloudinary après l'événement
4. **Backup** : Téléchargez TOUJOURS les médias avant de les supprimer

## 🆘 Dépannage

### "Erreur lors de l'upload"

- Vérifiez la taille du fichier (< 4 MB)
- Vérifiez vos credentials Cloudinary
- Vérifiez que `CLOUDINARY_FOLDER` est correctement défini

### "Aucune photo/vidéo"

- Vérifiez que `CLOUDINARY_FOLDER` correspond au bon dossier
- Vérifiez que les médias sont bien dans Cloudinary

## 📞 Support

Pour toute question, consultez la documentation :

- Cloudinary : https://cloudinary.com/documentation
- Vercel : https://vercel.com/docs
- Next.js : https://nextjs.org/docs
