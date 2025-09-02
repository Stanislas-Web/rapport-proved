# 📄 Générateur de PDF pour Fiches d'Auto-évaluation

## 🎯 **Vue d'ensemble**

Ce module permet de générer des PDF professionnels pour les fiches d'auto-évaluation en utilisant le même design officiel que les rapports d'activité.

## ✨ **Fonctionnalités**

- **Design officiel** : Même style et mise en page que les rapports d'activité
- **Génération côté frontend** : Utilise la fenêtre d'impression du navigateur
- **Formatage automatique** : Dates, scores et données formatés correctement
- **Responsive** : Optimisé pour l'impression et la conversion en PDF

## 🚀 **Utilisation**

### **1. Dans la liste des fiches**

Chaque fiche dispose d'un bouton PDF (icône document) dans la colonne Actions :
- Cliquez sur l'icône PDF pour générer le PDF de la fiche
- Le PDF s'ouvre dans une nouvelle fenêtre d'impression

### **2. Dans le modal de détails**

- Ouvrez les détails d'une fiche
- Cliquez sur le bouton "PDF" en haut à droite du modal
- Le PDF se génère automatiquement

## 🎨 **Design du PDF**

### **En-tête officiel**
- République Démocratique du Congo
- **Logo officiel du Ministère** (même image que les rapports d'activité)
- Ministère de l'Éducation Nationale
- Province Éducationnelle
- Titre principal : "FICHE D'AUTO-ÉVALUATION"

### **Sections organisées**
1. **Informations Générales**
   - Province Administrative
   - Directeur Provincial
   - Intitulé de la Formation
   - Date de création
   - Statut

2. **Contenu et Compréhension**
   - Clarté du contenu
   - Nouvelles connaissances acquises

3. **Participation et Implication**
   - Participation active
   - Rythme adapté

4. **Pertinence et Utilité**
   - Utilité des thèmes
   - Capacité d'application

5. **Suggestions et Commentaires**
   - Ce qui est apprécié
   - Améliorations suggérées
   - Autres commentaires

6. **Score Global** (si disponible)
   - Évaluation globale de la formation

### **Signature et validation**
- Espace pour la signature du participant
- Espace pour le cachet et signature officielle

## 🔧 **Structure technique**

### **Fichiers implémentés**
- `src/utils/generateFicheAutoEvaluationPDF.ts` - Générateur principal
- `src/pages/FicheAutoEvaluation/index.tsx` - Interface utilisateur

### **Fonctions principales**
- `generateFicheHTML()` - Génère le HTML du PDF
- `generateAndShowFichePDF()` - Affiche et imprime le PDF
- `handleGeneratePDF()` - Gestionnaire d'événement

### **Formatage des données**
- **Dates** : Format français (DD/MM/YYYY)
- **Scores** : Conversion automatique des évaluations
- **Données manquantes** : Gestion des valeurs nulles/undefined

### **Gestion des images**
- **Logo officiel** : Utilise `/image.png` (même source que les rapports d'activité)
- **Style cohérent** : Classe CSS `.header-logo` identique
- **Dimensions** : 80x80px avec `object-fit: contain`

### **Icône PDF cohérente**
- **Icône identique** : Même SVG que le rapport d'activité (document avec lignes)
- **Style uniforme** : Classe CSS `hover:text-blue-600` identique au rapport d'activité
- **Tooltip cohérent** : "Générer PDF" (même texte)
- **Couleurs cohérentes** : Bleu au survol, pas d'icônes noires
- **Visibilité garantie** : Couleur de base `text-gray-600` pour icône toujours visible
- **Rendu SVG optimisé** : Suppression de `fill-current` pour éviter les carrés noirs

## 📱 **Compatibilité**

- **Navigateurs** : Chrome, Firefox, Safari, Edge
- **Systèmes** : Windows, macOS, Linux
- **Impression** : PDF, impression papier
- **Responsive** : Optimisé pour tous les formats

## 🎯 **Avantages**

1. **Cohérence** : Même design que les rapports d'activité
2. **Rapidité** : Génération instantanée côté frontend
3. **Qualité** : Format professionnel et officiel
4. **Accessibilité** : Disponible pour tous les utilisateurs
5. **Flexibilité** : Impression ou sauvegarde en PDF
6. **Visibilité** : Icônes PDF en bleu, facilement identifiables
7. **Uniformité** : Couleurs cohérentes dans toute l'interface

## 🔍 **Dépannage**

### **Le PDF ne se génère pas**
- Vérifiez que le popup n'est pas bloqué
- Assurez-vous d'avoir les permissions d'impression

### **Formatage incorrect**
- Vérifiez que les données sont complètes
- Redémarrez l'application si nécessaire

### **Erreur de génération**
- Vérifiez la console du navigateur
- Assurez-vous que toutes les dépendances sont installées

## 📝 **Notes importantes**

- Le PDF utilise la fenêtre d'impression du navigateur
- La qualité dépend des paramètres d'impression
- Recommandé : Sauvegarder en PDF via l'option d'impression
- Compatible avec tous les gestionnaires de PDF

---

**Développé avec ❤️ pour le Ministère de l'Éducation Nationale**
