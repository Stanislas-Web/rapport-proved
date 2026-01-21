# Système de Gestion de Brouillon - Rapport d'Activité

## 🎯 Vue d'ensemble

Ce système implémente une gestion complète des brouillons pour le formulaire de rapport d'activité avec sauvegarde automatique, récupération et indicateurs visuels.

## ✨ Fonctionnalités

### 1. **Sauvegarde Automatique**
- ⏰ Sauvegarde automatique toutes les 30 secondes
- 💾 Stockage dans `localStorage` du navigateur
- 🔄 Détection intelligente des changements (ne sauvegarde que si modifié)
- ⚡ Sauvegarde immédiate avant de quitter la page

### 2. **Récupération de Brouillon**
- 🔍 Détection automatique au chargement de la page
- 📊 Affichage du pourcentage de complétion
- 📅 Information sur la dernière modification
- ✅ Liste des sections complétées
- ⚠️ Avertissement pour les brouillons anciens (>7 jours)

### 3. **Indicateurs Visuels**
- 📈 Barre de progression en temps réel
- 🟢 Statut de sauvegarde (Enregistré / En cours / Modifications non enregistrées)
- ⏱️ Horodatage de la dernière sauvegarde
- 🔴 Messages d'erreur en cas de problème

### 4. **Actions Disponibles**
- 💾 **Enregistrer le brouillon** : Sauvegarde manuelle et retour à la liste
- 🔄 **Reprendre le brouillon** : Charger le brouillon existant
- 🗑️ **Supprimer le brouillon** : Effacer et commencer à neuf
- ✓ **Soumettre** : Valider et supprimer le brouillon

## 📁 Architecture des Fichiers

```
src/
├── hooks/
│   └── useAutoSave.tsx          # Hook personnalisé pour l'auto-save
├── utils/
│   └── draftUtils.ts            # Utilitaires de gestion de brouillon
├── components/
│   ├── DraftIndicator.tsx       # Indicateur visuel de statut
│   └── DraftRecoveryModal.tsx   # Modal de récupération
└── pages/
    └── RapportActivite/
        └── create.tsx           # Intégration du système
```

## 🔧 Composants

### `useAutoSave` Hook

Hook React personnalisé pour la sauvegarde automatique avec debounce.

**Props:**
- `key`: Clé de stockage localStorage
- `data`: Données à sauvegarder
- `delay`: Délai en ms (défaut: 30000)
- `enabled`: Activer/désactiver (défaut: true)
- `onSave`: Callback après sauvegarde
- `onError`: Callback en cas d'erreur

**Retourne:**
- `lastSaved`: Date de dernière sauvegarde
- `isSaving`: Indicateur de sauvegarde en cours
- `hasUnsavedChanges`: Indicateur de modifications non sauvegardées
- `error`: Erreur éventuelle
- `forceSave`: Fonction pour forcer la sauvegarde
- `clearDraft`: Fonction pour effacer le brouillon

### `DraftIndicator` Component

Composant visuel affiché en haut à droite de la page.

**Props:**
- `lastSaved`: Date de dernière sauvegarde
- `isSaving`: État de sauvegarde
- `hasUnsavedChanges`: Modifications non sauvegardées
- `completionPercentage`: Pourcentage de complétion (0-100)
- `onForceSave`: Fonction pour forcer la sauvegarde
- `error`: Erreur éventuelle

### `DraftRecoveryModal` Component

Modal affiché au chargement si un brouillon existe.

**Props:**
- `draft`: Objet brouillon à afficher
- `onRestore`: Callback pour restaurer le brouillon
- `onDiscard`: Callback pour supprimer le brouillon
- `onCancel`: Callback pour annuler

## 🛠️ Utilisation

### Dans un composant

```typescript
import { useAutoSave } from '../../hooks/useAutoSave';
import DraftIndicator from '../../components/DraftIndicator';
import { calculateCompletionPercentage } from '../../utils/draftUtils';

const MyForm = () => {
  const [formData, setFormData] = useState(initialData);

  // Configuration de l'auto-save
  const autoSave = useAutoSave({
    key: 'my_form_draft',
    data: formData,
    delay: 30000,
    enabled: true,
    onSave: () => console.log('Sauvegardé!'),
    onError: (error) => console.error(error)
  });

  // Calcul de la progression
  const completionPercentage = calculateCompletionPercentage(formData);

  return (
    <>
      <DraftIndicator
        lastSaved={autoSave.lastSaved}
        isSaving={autoSave.isSaving}
        hasUnsavedChanges={autoSave.hasUnsavedChanges}
        completionPercentage={completionPercentage}
        onForceSave={autoSave.forceSave}
        error={autoSave.error}
      />
      {/* Votre formulaire */}
    </>
  );
};
```

### Fonctions utilitaires

```typescript
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  hasDraft,
  calculateCompletionPercentage,
  getDraftAge,
  formatTimeSince
} from '../utils/draftUtils';

// Sauvegarder
const draft = saveDraft(formData, 'Section IV');

// Charger
const existingDraft = loadDraft();

// Vérifier l'existence
if (hasDraft()) {
  // Un brouillon existe
}

// Calculer le pourcentage
const percentage = calculateCompletionPercentage(formData);

// Obtenir l'âge en jours
const age = getDraftAge();

// Formater le temps
const timeStr = formatTimeSince(new Date()); // "Il y a 5 minutes"
```

## 📊 Structure des Données

### Objet Draft

```typescript
interface Draft {
  formData: RapportActivite;
  metadata: {
    id: string;
    userId?: string;
    createdAt: string;
    lastSavedAt: string;
    lastModifiedAt: string;
    completionPercentage: number;
    currentSection: string;
    totalSections: number;
    completedSections: string[];
    status: 'draft' | 'submitted' | 'validated';
    version: number;
  };
}
```

## 🔐 Sécurité

- **localStorage seulement**: Les données sont stockées localement (pas envoyées au serveur avant soumission)
- **Chiffrement recommandé**: Pour les données sensibles, utilisez une bibliothèque comme `crypto-js`
- **Expiration**: Implémentez une logique d'expiration pour les brouillons anciens
- **Validation**: Toujours valider les données avant soumission finale

## 🚀 Optimisations Futures

### Backend Integration
- Synchronisation avec le serveur toutes les 2-3 minutes
- Gestion des conflits multi-appareils
- Historique des versions

### Compression
```bash
npm install lz-string
```

Puis dans `draftUtils.ts`:
```typescript
import LZString from 'lz-string';

export const compressData = (data: any): string => {
  return LZString.compress(JSON.stringify(data));
};

export const decompressData = (compressed: string): any => {
  const decompressed = LZString.decompress(compressed);
  return decompressed ? JSON.parse(decompressed) : null;
};
```

### IndexedDB
Pour des données plus volumineuses, utiliser IndexedDB au lieu de localStorage:
```bash
npm install idb
```

## 📝 Notes Importantes

1. **Limite de localStorage**: ~5MB par domaine
2. **Données sensibles**: Ne jamais stocker de mots de passe ou tokens
3. **Navigation privée**: localStorage peut ne pas être disponible
4. **Multi-onglets**: Les changements sont partagés entre onglets
5. **beforeunload**: Peut être bloqué par certains navigateurs

## 🐛 Dépannage

### Le brouillon ne se sauvegarde pas
- Vérifier que localStorage est activé
- Vérifier la console pour les erreurs
- Vérifier l'espace disponible dans localStorage

### Le modal ne s'affiche pas
- Vérifier que `hasDraft()` retourne true
- Vérifier l'état `showDraftModal`
- Vérifier la console pour les erreurs de parsing

### Pourcentage de complétion incorrect
- Ajuster la logique dans `calculateCompletionPercentage`
- Adapter selon votre structure de données

## 📚 Références

- [localStorage MDN](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)
- [beforeunload MDN](https://developer.mozilla.org/fr/docs/Web/API/Window/beforeunload_event)
- [React Hooks](https://react.dev/reference/react)

---

**Développé avec ❤️ pour le système PROVED**
