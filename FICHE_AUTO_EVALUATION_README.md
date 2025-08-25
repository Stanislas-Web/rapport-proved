# Module Fiche Auto-évaluation

## Description

Le module "Fiche Auto-évaluation" permet aux utilisateurs de créer et gérer des fiches d'auto-évaluation pour les formations. Ce module est inspiré du module "Rapport Activité" et suit la même logique de développement.

## Structure du Module

### Modèles (Models)
- `src/models/FicheAutoEvaluation.ts` - Définit les interfaces TypeScript pour les fiches d'auto-évaluation

### Services
- `src/services/ficheAutoEvaluation/ficheAutoEvaluationService.ts` - Gère les appels API pour les fiches d'auto-évaluation

### Pages
- `src/pages/FicheAutoEvaluation/index.tsx` - Page principale listant toutes les fiches
- `src/pages/FicheAutoEvaluation/create.tsx` - Page de création d'une nouvelle fiche
- `src/pages/FicheAutoEvaluation/edit.tsx` - Page de modification d'une fiche existante

## Fonctionnalités

### 1. Liste des Fiches
- Affichage de toutes les fiches d'auto-évaluation
- Filtrage par statut (Brouillon, Soumis, Approuvé, Rejeté)
- Recherche par intitulé de formation, noms ou provenance
- Actions : Voir, Modifier, Supprimer
- Export Excel des données

### 2. Création de Fiche
- Formulaire complet avec sections organisées :
  - **Informations Générales** : Intitulé formation, noms, provenance
  - **Contenu et Compréhension** : Évaluation de la clarté et des nouvelles connaissances
  - **Participation et Implication** : Évaluation de la participation active et du rythme
  - **Pertinence et Utilité** : Évaluation de l'utilité des thèmes et de la capacité d'application
  - **Suggestions et Commentaires** : Zones de texte libres pour les retours

### 3. Modification de Fiche
- Même interface que la création
- Chargement automatique des données existantes
- Validation des champs obligatoires

### 4. Gestion des Statuts
- Brouillon (par défaut)
- Soumis
- Approuvé
- Rejeté

## Schéma de Données

Le module utilise le schéma MongoDB suivant :

```javascript
const ficheAutoEvaluationSchema = new Schema({
  identificationProved: {
    type: Schema.Types.ObjectId,
    ref: 'IdentificationProved',
    required: true
  },
  intituleFormation: {
    type: String,
    required: true
  },
  noms: {
    type: String,
    required: true
  },
  provenance: {
    type: String,
    enum: ['Proved', 'IPP'],
    required: true
  },
  contenuComprehension: {
    contenuClair: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    },
    nouvellesConnaissances: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    }
  },
  participationImplication: {
    participationActive: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    },
    rythmeAdapte: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    }
  },
  pertinenceUtilite: {
    themesUtiles: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    },
    capaciteApplication: {
      type: String,
      enum: ['Pas du tout', 'Peu', 'Assez', 'Beaucoup', 'Tout à fait'],
      default: 'Assez'
    }
  },
  suggestionsCommentaires: {
    ceQuiApprecie: {
      type: String,
      default: ''
    },
    ameliorations: {
      type: String,
      default: ''
    },
    autresCommentaires: {
      type: String,
      default: ''
    }
  },
  statut: {
    type: String,
    enum: ['brouillon', 'soumis', 'approuve', 'rejete'],
    default: 'brouillon'
  }
}, {
  timestamps: true,
  versionKey: false
});
```

## Routes

- `/fiche-auto-evaluation` - Liste des fiches
- `/fiche-auto-evaluation/create` - Création d'une nouvelle fiche
- `/fiche-auto-evaluation/edit/:id` - Modification d'une fiche

## Navigation

Le module est accessible via le menu latéral "Fiche Auto-évaluation" avec l'icône d'évaluation.

## API Endpoints

Le service utilise les endpoints suivants :
- `GET /fiche-auto-evaluation` - Récupérer toutes les fiches
- `GET /fiche-auto-evaluation/:id` - Récupérer une fiche par ID
- `POST /fiche-auto-evaluation` - Créer une nouvelle fiche
- `PUT /fiche-auto-evaluation/:id` - Mettre à jour une fiche
- `DELETE /fiche-auto-evaluation/:id` - Supprimer une fiche
- `PATCH /fiche-auto-evaluation/:id/statut` - Changer le statut d'une fiche

## Technologies Utilisées

- **Frontend** : React, TypeScript, Tailwind CSS
- **État** : React Hooks (useState, useEffect)
- **Navigation** : React Router
- **Notifications** : React Hot Toast
- **Export** : XLSX, FileSaver
- **Dates** : Moment.js

## Intégration

Le module est entièrement intégré dans l'application existante :
- Utilise le même layout (DefaultLayout)
- Suit les mêmes conventions de nommage
- Utilise les mêmes composants UI
- Respecte la gestion des rôles et permissions

## Utilisation

1. Accéder au module via le menu "Fiche Auto-évaluation"
2. Cliquer sur "Nouvelle Fiche" pour créer une fiche
3. Remplir le formulaire avec les informations requises
4. Sauvegarder en brouillon ou soumettre directement
5. Utiliser les filtres et la recherche pour trouver des fiches
6. Exporter les données en Excel si nécessaire
