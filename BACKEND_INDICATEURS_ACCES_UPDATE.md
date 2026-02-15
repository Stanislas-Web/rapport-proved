# 🔧 Mise à jour Backend - Indicateurs d'Accès & Formations des Gestionnaires

## ⚠️ URGENT: Ajouter les champs manquants

### 🎯 Problème 1: Indicateurs d'Accès (IV.7 - Section Réalisations)

**Fichier Backend à Modifier:** `models/RapportActivite.js`
**Section:** `realisations.accesAccessibiliteEquite.indicateursAcces`

**AVANT (schéma actuel):**
```javascript
indicateursAcces: {
  proportionNouveauxInscrits: { type: Number, default: 0 },
  tauxTransitionPrimaireCTEB: { type: Number, default: 0 },
  tauxTransitionCTEBHumanites: { type: Number, default: 0 }
}
```

**APRÈS (nouveau schéma avec colonnes Filles):**
```javascript
indicateursAcces: {
  proportionNouveauxInscrits: { type: Number, default: 0 },
  proportionNouveauxInscrits_Filles: { type: Number, default: 0 },
  tauxTransitionPrimaireCTEB: { type: Number, default: 0 },
  tauxTransitionPrimaireCTEB_Filles: { type: Number, default: 0 },
  tauxTransitionCTEBHumanites: { type: Number, default: 0 },
  tauxTransitionCTEBHumanites_Filles: { type: Number, default: 0 }
}
```

### 🎯 Problème 2: Formations des Gestionnaires (IV.9 - Section Gouvernance)

**Fichier Backend à Modifier:** `models/RapportActivite.js`
**Section:** `gouvernance` (après `vulgarisationInstructions`)

**AJOUTER:**
```javascript
formationsGestionnaires: {
  leadershipScolaire: {
    tauxGF: { type: Number, default: 0 },
    tauxFilles: { type: Number, default: 0 }
  },
  managementScolaire: {
    tauxGF: { type: Number, default: 0 },
    tauxFilles: { type: Number, default: 0 }
  },
  calculIndicateurs: {
    tauxGF: { type: Number, default: 0 },
    tauxFilles: { type: Number, default: 0 }
  },
  gestionEntiteEducationnelle: {
    tauxGF: { type: Number, default: 0 },
    tauxFilles: { type: Number, default: 0 }
  },
  planification: {
    tauxGF: { type: Number, default: 0 },
    tauxFilles: { type: Number, default: 0 }
  }
},
commentaireFormations: { type: String, default: '' }
```

### 📝 Position exacte dans le schéma MongoDB

```javascript
gouvernance: {
  // ... autres champs existants ...
  vulgarisationInstructions: {
    instructionsOfficielles: String,
    nouvelleCitoyennete: String
  },
  // AJOUTER ICI ↓
  formationsGestionnaires: {
    leadershipScolaire: {
      tauxGF: { type: Number, default: 0 },
      tauxFilles: { type: Number, default: 0 }
    },
    managementScolaire: {
      tauxGF: { type: Number, default: 0 },
      tauxFilles: { type: Number, default: 0 }
    },
    calculIndicateurs: {
      tauxGF: { type: Number, default: 0 },
      tauxFilles: { type: Number, default: 0 }
    },
    gestionEntiteEducationnelle: {
      tauxGF: { type: Number, default: 0 },
      tauxFilles: { type: Number, default: 0 }
    },
    planification: {
      tauxGF: { type: Number, default: 0 },
      tauxFilles: { type: Number, default: 0 }
    }
  },
  commentaireFormations: { type: String, default: '' },
  // PUIS les champs existants suivants
  groupesAidesPsychopedagogiques: {
    // ...
  }
}
```

### ✅ Test après modification
Après avoir mis à jour le schéma backend:

1. **Redémarrer le serveur backend**
2. **Tester avec curl:**

**Test Indicateurs d'Accès:**
```bash
TOKEN="votre_token_ici"
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
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

**Test Formations des Gestionnaires:**
```bash
TOKEN="votre_token_ici"
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "gouvernance": {
      "formationsGestionnaires": {
        "leadershipScolaire": { "tauxGF": 78.5, "tauxFilles": 42.3 },
        "managementScolaire": { "tauxGF": 82.1, "tauxFilles": 45.8 },
        "calculIndicateurs": { "tauxGF": 65.4, "tauxFilles": 38.2 },
        "gestionEntiteEducationnelle": { "tauxGF": 71.9, "tauxFilles": 41.5 },
        "planification": { "tauxGF": 68.7, "tauxFilles": 39.6 }
      },
      "commentaireFormations": "Les formations ont été dispensées avec un taux de participation satisfaisant."
    }
  }'
```

3. **Vérifier avec GET:**
```bash
curl -s -X GET "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.docs[0].realisations.accesAccessibiliteEquite.indicateursAcces'

curl -s -X GET "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.docs[0].gouvernance.formationsGestionnaires'
```

### 🎯 Impact
**Pour Indicateurs d'Accès (IV.7):**
- ✅ Les utilisateurs pourront saisir les taux pour Filles
- ✅ Les données seront chargées correctement en modification
- ✅ Le PDF et le modal afficheront les 2 colonnes
- ✅ Le calcul automatique dans le modal fonctionnera pour GF et F

**Pour Formations des Gestionnaires (IV.9):**
- ✅ Les 5 formations (Leadership, Management, Calcul indicateurs, Gestion, Planification) seront sauvegardées
- ✅ Chaque formation aura 2 taux (GF et Filles)
- ✅ Les données se chargeront en modification
- ✅ Le commentaire sur les modules sera préservé

### 📌 Notes Importantes
- Tous les champs ajoutés sont optionnels (avec valeurs par défaut à 0)
- Compatible avec les rapports existants (valeurs par défaut appliquées)
- Aucune migration de données nécessaire
- Le frontend est 100% prêt pour ces modifications

---
**Date de demande:** 14 février 2026  
**Développeur frontend:** Stanislas Makengo  
**Priorité:** ⚡ HAUTE - Bloque la saisie complète de 2 sections importantes
