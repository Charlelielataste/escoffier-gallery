# 🚀 Déploiement sur Vercel - Guide Complet

Guide étape par étape pour déployer l'application Escoffier Gallery sur Vercel gratuitement.

## 📋 Prérequis

- ✅ Compte GitHub (gratuit)
- ✅ Compte Vercel (gratuit) - https://vercel.com/signup
- ✅ Compte Cloudinary configuré avec vos credentials
- ✅ Code pushé sur GitHub

## 🔧 Étape 1 : Préparer le Repository GitHub

### 1.1 Créer un repository GitHub

```bash
# Si ce n'est pas déjà fait
cd /Users/charlelielataste/Sites/escoffier-gallery
git init
git add .
git commit -m "Initial commit: Escoffier Gallery"
```

### 1.2 Pusher sur GitHub

1. Allez sur https://github.com/new
2. Créez un nouveau repository (ex: `escoffier-gallery`)
3. Suivez les instructions pour pusher votre code :

```bash
git remote add origin https://github.com/votre-username/escoffier-gallery.git
git branch -M main
git push -u origin main
```

## 🚀 Étape 2 : Déployer sur Vercel

### 2.1 Connexion à Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

### 2.2 Importer le Projet

1. Sur le Dashboard Vercel, cliquez sur **"Add New..."**
2. Sélectionnez **"Project"**
3. Trouvez votre repository `escoffier-gallery`
4. Cliquez sur **"Import"**

### 2.3 Configurer le Projet

#### Framework Preset

- Vercel détectera automatiquement **Next.js** ✅

#### Project Name

- Laissez le nom par défaut ou personnalisez (ex: `escoffier-gallery-nov2025`)

#### Root Directory

- Laissez vide (`.`)

### 2.4 Configurer les Variables d'Environnement

⚠️ **TRÈS IMPORTANT** : Avant de déployer, ajoutez vos variables d'environnement !

1. Dépliez la section **"Environment Variables"**
2. Ajoutez les 4 variables suivantes :

| Name                                | Value                | Environment                      |
| ----------------------------------- | -------------------- | -------------------------------- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `votre_cloud_name`   | Production, Preview, Development |
| `CLOUDINARY_API_KEY`                | `votre_api_key`      | Production, Preview, Development |
| `CLOUDINARY_API_SECRET`             | `votre_api_secret`   | Production, Preview, Development |
| `CLOUDINARY_FOLDER`                 | `escoffier-nov-2025` | Production, Preview, Development |

**Comment obtenir ces valeurs ?**

- Connectez-vous à votre Dashboard Cloudinary : https://cloudinary.com/console
- Vous trouverez ces informations en haut de la page

**Pour chaque variable :**

1. Cliquez sur **"Add"**
2. Tapez le **Name** (nom de la variable)
3. Tapez la **Value** (valeur)
4. Cochez **Production**, **Preview**, et **Development**
5. Cliquez sur **"Add"**

### 2.5 Lancer le Déploiement

1. Une fois toutes les variables ajoutées, cliquez sur **"Deploy"**
2. Attendez 1-2 minutes (Vercel va :
   - Installer les dépendances
   - Builder l'application
   - Déployer sur leur CDN)
3. 🎉 Votre application est en ligne !

## 🌐 Étape 3 : Accéder à votre Application

### URL de Production

Vercel vous donnera une URL automatique :

- Format : `https://escoffier-gallery.vercel.app`
- Ou : `https://escoffier-gallery-votre-username.vercel.app`

### Domaine Personnalisé (Optionnel)

Si vous avez un domaine :

1. Allez dans **Settings** > **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions DNS

## 🔄 Étape 4 : Mises à Jour Automatiques

Chaque fois que vous pushez sur GitHub :

1. Vercel détecte automatiquement les changements
2. Lance un nouveau build
3. Déploie la nouvelle version
4. Votre site est mis à jour !

```bash
# Pour mettre à jour l'application
git add .
git commit -m "Description des changements"
git push
# Vercel déploie automatiquement !
```

## 🎯 Étape 5 : Pour Chaque Nouvel Événement

### Option A : Modifier les Variables d'Environnement

1. Allez sur le Dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Modifiez `CLOUDINARY_FOLDER` (ex: `escoffier-dec-2025`)
5. Sauvegardez
6. Allez dans **Deployments**
7. Cliquez sur les 3 points du dernier déploiement
8. Cliquez sur **"Redeploy"**

### Option B : Créer un Nouveau Projet Vercel

Pour garder l'historique des événements :

1. Créez une nouvelle branche dans GitHub (ex: `event-dec-2025`)
2. Importez-la comme nouveau projet dans Vercel
3. Configurez avec un nouveau `CLOUDINARY_FOLDER`

## 📊 Monitoring et Logs

### Voir les Logs

1. Dashboard Vercel > Votre Projet
2. Onglet **"Deployments"**
3. Cliquez sur un déploiement
4. Onglet **"Functions"** pour voir les logs des API

### Analyser le Trafic

1. Dashboard Vercel > Votre Projet
2. Onglet **"Analytics"** (disponible même en gratuit)
3. Voyez :
   - Nombre de visiteurs
   - Pages vues
   - Performance

## ⚠️ Limites du Plan Gratuit Vercel

| Ressource            | Limite Gratuite | Suffisant pour vous ? |
| -------------------- | --------------- | --------------------- |
| Bandwidth            | 100 GB/mois     | ✅ Oui (~200 invités) |
| Build Time           | 6000 min/mois   | ✅ Oui                |
| Serverless Functions | 100 GB-hrs      | ✅ Oui                |
| Function Execution   | 10 secondes max | ✅ Oui                |
| Body Size            | 4.5 MB          | ⚠️ À surveiller       |

### Si vous dépassez la limite de 4.5 MB

- **Solution gratuite** : Demandez aux invités de réduire la taille des fichiers
- **Solution payante** : Passez à Vercel Pro (20$/mois)

## 🔒 Sécurité

### Variables d'Environnement

- ✅ Jamais commitées dans Git (`.gitignore` les protège)
- ✅ Chiffrées par Vercel
- ✅ Accessibles uniquement côté serveur (sauf `NEXT_PUBLIC_*`)

### API Routes

- ✅ Protégées par les credentials Cloudinary
- ⚠️ Pas d'authentification utilisateur (URL privée partagée)

### Recommandations

- Ne partagez l'URL qu'avec les invités
- Changez `CLOUDINARY_FOLDER` après chaque événement
- Supprimez les anciens déploiements si besoin

## 🧪 Test après Déploiement

### Checklist de Vérification

1. [ ] La page d'accueil s'affiche correctement
2. [ ] Le logo Escoffier est visible
3. [ ] Page `/upload` fonctionne
   - [ ] Sélection photo/vidéo fonctionne
   - [ ] Upload d'une photo test réussit
   - [ ] Upload d'une vidéo test réussit
4. [ ] Page `/gallery` fonctionne
   - [ ] Les photos s'affichent
   - [ ] Les vidéos se lisent
   - [ ] Les onglets fonctionnent
5. [ ] Navigation entre pages fonctionne
6. [ ] Responsive mobile fonctionne

### Test Rapide

1. Allez sur votre URL Vercel
2. Uploadez une photo de test (< 2 MB)
3. Allez dans la galerie
4. Vérifiez qu'elle apparaît
5. Supprimez-la depuis Cloudinary si c'est un test

## 🆘 Dépannage

### "Build Failed"

- Vérifiez les logs de build dans Vercel
- Assurez-vous que `npm run build` fonctionne localement
- Vérifiez que toutes les dépendances sont dans `package.json`

### "Function Error"

- Vérifiez que les variables d'environnement sont bien configurées
- Vérifiez les logs de la fonction dans Vercel
- Testez les routes API localement d'abord

### "Images ne s'affichent pas"

- Vérifiez `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Vérifiez que les domaines sont autorisés dans `next.config.ts`
- Vérifiez les logs de la console navigateur (F12)

### "Upload échoue"

- Vérifiez toutes les variables d'environnement Cloudinary
- Vérifiez que le fichier est < 4.5 MB
- Vérifiez les logs de la fonction `/api/upload`

## 📞 Support

### Documentation Officielle

- **Vercel** : https://vercel.com/docs
- **Next.js** : https://nextjs.org/docs
- **Cloudinary** : https://cloudinary.com/documentation

### Community

- Vercel Discord : https://vercel.com/discord
- Next.js Discussions : https://github.com/vercel/next.js/discussions

## ✅ Résumé Rapide

1. **Push sur GitHub** ✅
2. **Import dans Vercel** ✅
3. **Configurer 4 variables d'environnement** ✅
4. **Deploy** ✅
5. **Tester l'application** ✅
6. **Partager l'URL avec les invités** ✅

⏱️ **Temps total** : 15-20 minutes

🎉 **Votre application est maintenant en ligne et prête à recevoir les photos et vidéos de l'événement !**
