# ⚠️ PROBLÈME: Colonne F vide dans IV.7 (Mode Modification)

## Symptôme

Lorsqu'on ouvre un rapport existant en mode modification, la section **IV.7. Indicateurs d'accès: Proportion & Transition** affiche:
- ✅ Colonne **% GF** : valeurs chargées correctement (96.2, 89.5, 84.8)
- ❌ Colonne **F** : toutes les valeurs à 0 ou vides

## Cause racine

Le backend ne stocke actuellement que **3 champs** au lieu de **6** :

### ✅ Ce qui existe dans le backend
```json
{
  "realisations": {
    "accesAccessibiliteEquite": {
      "indicateursAcces": {
        "proportionNouveauxInscrits": 96.2,
        "tauxTransitionPrimaireCTEB": 89.5,
        "tauxTransitionCTEBHumanites": 84.8
      }
    }
  }
}
```

### ❌ Ce qui manque
```json
{
  "proportionNouveauxInscrits_Filles": 0,  // ← MANQUANT
  "tauxTransitionPrimaireCTEB_Filles": 0,  // ← MANQUANT
  "tauxTransitionCTEBHumanites_Filles": 0  // ← MANQUANT
}
```

## Impact

- ✅ **Mode création** : Fonctionne (utilisateur saisit les 6 valeurs)
- ❌ **Mode modification** : Colonne F vide (backend ne renvoie pas les valeurs)
- ⚠️ **Sauvegarde** : Si l'utilisateur saisit manuellement les valeurs F, elles sont envoyées au backend mais **ignorées** car le schéma ne les accepte pas

## Solution temporaire (Frontend)

Le frontend est déjà configuré pour accepter la saisie manuelle des 6 champs. L'utilisateur peut:

1. Ouvrir le rapport en modification
2. Constater que les colonnes % GF sont remplies
3. **Saisir manuellement** les valeurs dans la colonne F
4. Sauvegarder

**Limitation** : Les valeurs saisies dans la colonne F ne persisteront pas au prochain chargement tant que le backend n'est pas mis à jour.

## Solution permanente (Backend requis)

### 1. Mettre à jour le schéma Mongoose

**Fichier:** `models/RapportActivite.js` (ou similaire)

**Localisation:** Section `realisations.accesAccessibiliteEquite.indicateursAcces`

**Modification:**
```javascript
// AVANT (3 champs)
indicateursAcces: {
  proportionNouveauxInscrits: { type: Number, default: null },
  tauxTransitionPrimaireCTEB: { type: Number, default: null },
  tauxTransitionCTEBHumanites: { type: Number, default: null }
}

// APRÈS (6 champs)
indicateursAcces: {
  proportionNouveauxInscrits: { type: Number, default: null },
  proportionNouveauxInscrits_Filles: { type: Number, default: null }, // ← AJOUTER
  tauxTransitionPrimaireCTEB: { type: Number, default: null },
  tauxTransitionPrimaireCTEB_Filles: { type: Number, default: null }, // ← AJOUTER
  tauxTransitionCTEBHumanites: { type: Number, default: null },
  tauxTransitionCTEBHumanites_Filles: { type: Number, default: null } // ← AJOUTER
}
```

### 2. Mettre à jour les validations (si applicable)

Si des validations existent pour `indicateursAcces`, ajouter les nouveaux champs:

```javascript
// Validation Joi/Yup/etc.
indicateursAcces: Joi.object({
  proportionNouveauxInscrits: Joi.number().min(0).max(100).allow(null),
  proportionNouveauxInscrits_Filles: Joi.number().min(0).max(100).allow(null), // ← AJOUTER
  tauxTransitionPrimaireCTEB: Joi.number().min(0).max(100).allow(null),
  tauxTransitionPrimaireCTEB_Filles: Joi.number().min(0).max(100).allow(null), // ← AJOUTER
  tauxTransitionCTEBHumanites: Joi.number().min(0).max(100).allow(null),
  tauxTransitionCTEBHumanites_Filles: Joi.number().min(0).max(100).allow(null) // ← AJOUTER
})
```

### 3. Migration des données existantes (optionnel)

Si des rapports existent déjà avec seulement 3 champs, ils continueront de fonctionner (les champs `_Filles` seront `null`).

**Script de migration (optionnel):**
```javascript
// Pour initialiser les nouveaux champs à 0 dans les rapports existants
db.rapports.updateMany(
  { 
    "realisations.accesAccessibiliteEquite.indicateursAcces": { $exists: true }
  },
  { 
    $set: {
      "realisations.accesAccessibiliteEquite.indicateursAcces.proportionNouveauxInscrits_Filles": 0,
      "realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionPrimaireCTEB_Filles": 0,
      "realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionCTEBHumanites_Filles": 0
    }
  }
);
```

## Test de vérification

Après mise à jour du backend:

### 1. Créer un rapport avec les 6 valeurs
```bash
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realisations": {
      "accesAccessibiliteEquite": {
        "indicateursAcces": {
          "proportionNouveauxInscrits": 96.2,
          "proportionNouveauxInscrits_Filles": 94.8,
          "tauxTransitionPrimaireCTEB": 89.5,
          "tauxTransitionPrimaireCTEB_Filles": 86.3,
          "tauxTransitionCTEBHumanites": 84.8,
          "tauxTransitionCTEBHumanites_Filles": 81.2
        }
      }
    }
  }'
```

### 2. Vérifier le GET
```bash
curl -X GET "https://www.edu-nc.site/api/v1/rapport-activite/{ID}" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.realisations.accesAccessibiliteEquite.indicateursAcces'
```

**Résultat attendu:**
```json
{
  "proportionNouveauxInscrits": 96.2,
  "proportionNouveauxInscrits_Filles": 94.8,
  "tauxTransitionPrimaireCTEB": 89.5,
  "tauxTransitionPrimaireCTEB_Filles": 86.3,
  "tauxTransitionCTEBHumanites": 84.8,
  "tauxTransitionCTEBHumanites_Filles": 81.2
}
```

### 3. Tester dans le frontend
1. Créer un nouveau rapport
2. Remplir la section IV.7 avec les 6 valeurs (% GF + F)
3. Sauvegarder
4. Fermer et rouvrir le rapport
5. **Vérifier que les 6 colonnes sont chargées** ✅

## État actuel

| Composant | Statut | Détails |
|-----------|--------|---------|
| Frontend TypeScript Model | ✅ Prêt | 6 champs définis dans `RapportActivite.ts` |
| Frontend Component (Realisations) | ✅ Prêt | Charge et affiche les 6 champs |
| Backend Schema | ❌ Incomplet | Seulement 3 champs |
| Backend API | ❌ Incomplet | N'accepte/ne retourne pas les champs `_Filles` |

## Priorité

🔴 **HAUTE** - Bloque la saisie complète des données en mode modification

## Documentation technique complète

Voir [BACKEND_INDICATEURS_ACCES_UPDATE.md](BACKEND_INDICATEURS_ACCES_UPDATE.md) pour les détails d'implémentation backend.

---

**Date:** 14 février 2026  
**Statut:** ⏳ EN ATTENTE DE MISE À JOUR BACKEND  
**Contact Frontend:** Code déjà prêt et testé ✅
