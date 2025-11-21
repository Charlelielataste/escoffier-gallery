# 💾 Sauvegarde des Médias depuis Cloudinary

Guide pour télécharger et sauvegarder tous les médias d'un événement avant de les supprimer de Cloudinary.

## 📋 Pourquoi sauvegarder ?

- **Archivage** : Conserver les souvenirs de chaque événement
- **Libérer l'espace** : Le plan gratuit Cloudinary est limité à 25 GB
- **Réutilisation** : Pouvoir consulter les médias plus tard

## 🔄 Workflow Recommandé

### Fin de l'événement (après 1 mois)

1. ✅ **Télécharger** tous les médias
2. ✅ **Vérifier** que tous les fichiers sont bien sauvegardés
3. ✅ **Supprimer** le dossier de l'événement sur Cloudinary
4. ✅ **Archiver** localement (disque dur externe recommandé)

**📂 Note** : Quel que soit votre [mode de dossiers Cloudinary](https://cloudinary.com/documentation/folder_modes) (Fixed ou Dynamic), les méthodes ci-dessous fonctionnent de la même manière. Vos médias sont organisés dans le dossier que vous avez défini dans `CLOUDINARY_FOLDER`.

## 📥 Méthode 1 : Via l'Interface Cloudinary (Plus Simple)

### Étape 1 : Se connecter

1. Allez sur https://cloudinary.com
2. Connectez-vous à votre compte

### Étape 2 : Accéder au Media Library

1. Cliquez sur **Media Library** dans le menu
2. Naviguez jusqu'au dossier de l'événement (ex: `escoffier-nov-2025`)

### Étape 3 : Télécharger

1. **Sélectionner tous les médias** :

   - Cliquez sur la première image
   - Maintenez Shift
   - Cliquez sur la dernière image
   - Ou utilisez Ctrl+A (Cmd+A sur Mac)

2. **Télécharger** :
   - Cliquez sur le bouton "Download" (⬇️)
   - Cloudinary créera un fichier ZIP
   - Le téléchargement commencera automatiquement

### Étape 4 : Vérifier

1. Décompressez le fichier ZIP
2. Vérifiez que tous les médias sont présents
3. Testez quelques fichiers pour s'assurer qu'ils ne sont pas corrompus

### Étape 5 : Supprimer sur Cloudinary

1. Retournez dans le Media Library
2. Sélectionnez le dossier de l'événement
3. Cliquez sur "Delete"
4. Confirmez la suppression

⚠️ **IMPORTANT** : Ne supprimez qu'après avoir vérifié que la sauvegarde est complète !

## 📥 Méthode 2 : Via l'API Cloudinary (Avancé)

Pour les utilisateurs techniques qui préfèrent automatiser.

### Prérequis

```bash
npm install -g cloudinary-cli
```

### Configuration

```bash
cloudinary config set cloud_name YOUR_CLOUD_NAME
cloudinary config set api_key YOUR_API_KEY
cloudinary config set api_secret YOUR_API_SECRET
```

### Télécharger tous les médias d'un dossier

```bash
# Photos
cloudinary download folder escoffier-nov-2025 --resource-type image --output-dir ./backup/escoffier-nov-2025/images

# Vidéos
cloudinary download folder escoffier-nov-2025 --resource-type video --output-dir ./backup/escoffier-nov-2025/videos
```

### Supprimer le dossier

```bash
# Après avoir vérifié la sauvegarde !
cloudinary destroy folder escoffier-nov-2025 --resource-type image
cloudinary destroy folder escoffier-nov-2025 --resource-type video
```

## 📦 Organisation Recommandée

Organisez vos sauvegardes par événement :

```
/Archives_Escoffier/
  /2025-01-Galette/
    /images/
    /videos/
  /2025-02-Saint-Valentin/
    /images/
    /videos/
  /2025-03-Printemps/
    /images/
    /videos/
```

## 💡 Conseils

### Stockage

- **Disque dur externe** : Recommandé pour les sauvegardes à long terme
- **Cloud personnel** : Google Drive, Dropbox, etc. (vérifiez la capacité)
- **Double sauvegarde** : Gardez 2 copies (disque dur + cloud)

### Nommage

- Utilisez un format cohérent : `YYYY-MM-NomEvenement`
- Ajoutez la date : `2025-11-DinerGala`
- Soyez descriptif : facilite la recherche plus tard

### Compression

- Les photos JPEG sont déjà compressées
- Les vidéos peuvent être recompressées avec Handbrake si nécessaire
- Un ZIP peut aider à organiser mais n'économise pas beaucoup d'espace

## 📊 Estimation de l'Espace

Pour un événement typique avec 200 invités :

- **Photos** : ~2000 photos × 3-5 MB = 6-10 GB
- **Vidéos** : ~200 vidéos × 10-50 MB = 2-10 GB
- **Total** : 8-20 GB par événement

➡️ **Recommandation** : Disque dur externe de 1 TB = suffisant pour ~50 événements

## ⚠️ Checklist de Sécurité

Avant de supprimer sur Cloudinary, vérifiez :

- [ ] Tous les médias sont téléchargés
- [ ] Le ZIP/dossier se décompresse correctement
- [ ] Aucun fichier corrompu
- [ ] Sauvegarde faite sur 2 supports différents
- [ ] L'événement est bien terminé (plus de nouveaux uploads)

## 🔧 Dépannage

### "Le téléchargement échoue"

- **Solution** : Téléchargez par lots de 50-100 médias
- Cloudinary peut avoir des limites sur les gros ZIP

### "Certains fichiers manquent"

- Vérifiez dans les sous-dossiers de Cloudinary
- Utilisez la recherche par date
- Vérifiez les deux resource_type (image et video)

### "Pas assez d'espace disque"

- Libérez de l'espace sur votre disque
- Utilisez un disque externe
- Compressez les vidéos si nécessaire

## 📞 Support

En cas de problème :

- Documentation Cloudinary : https://cloudinary.com/documentation
- Support Cloudinary : https://support.cloudinary.com

## 🎯 Résumé Rapide

```bash
1. Télécharger tous les médias (ZIP depuis l'interface)
2. Vérifier l'intégrité de la sauvegarde
3. Créer une copie de secours
4. Supprimer le dossier sur Cloudinary
5. Archiver proprement avec un bon nommage
```

⏱️ **Temps estimé** : 30-60 minutes selon le nombre de médias
