# 🔧 Backend Update - Formations des Gestionnaires

## 📋 Section: IV.9. Formation des Gestionnaires des BG Provinciaux et de Proximité

### ⚠️ Problème
Le champ `formationsGestionnaires` n'existe pas dans le schéma MongoDB. Le backend retourne `null`.

### 🎯 Solution
Ajouter le champ `formationsGestionnaires` dans le modèle `RapportActivite`.

---

## 📝 Modification à effectuer

**Fichier:** `models/RapportActivite.js` (ou votre fichier de modèle MongoDB)

**Localisation:** Dans l'objet `gouvernance`, après `vulgarisationInstructions`

### Code à ajouter:

```javascript
gouvernance: {
  // ... champs existants ...
  
  vulgarisationInstructions: {
    instructionsOfficielles: String,
    nouvelleCitoyennete: String
  },
  
  // ⬇️ AJOUTER CE BLOC ICI ⬇️
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
  // ⬆️ FIN DU BLOC À AJOUTER ⬆️
  
  groupesAidesPsychopedagogiques: {
    // ... champs existants ...
  }
}
```

---

## ✅ Test

### 1. Redémarrer le serveur backend

### 2. Tester avec curl POST:

```bash
TOKEN="votre_token_ici"
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "identificationProved": "6970af4de0355a44bca8a5b9",
    "annee": "2024-2025",
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

### 3. Vérifier avec GET:

```bash
curl -s -X GET "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.docs[0].gouvernance.formationsGestionnaires'
```

**Résultat attendu:**
```json
{
  "leadershipScolaire": { "tauxGF": 78.5, "tauxFilles": 42.3 },
  "managementScolaire": { "tauxGF": 82.1, "tauxFilles": 45.8 },
  "calculIndicateurs": { "tauxGF": 65.4, "tauxFilles": 38.2 },
  "gestionEntiteEducationnelle": { "tauxGF": 71.9, "tauxFilles": 41.5 },
  "planification": { "tauxGF": 68.7, "tauxFilles": 39.6 }
}
```

---

## 📊 Explication

Le formulaire frontend a un tableau avec **5 formations** et **2 colonnes de taux**:

| Formation | Taux GF (%) | Taux F (%) |
|-----------|-------------|------------|
| En Leadership Scolaire | tauxGF | tauxFilles |
| En Management Scolaire | tauxGF | tauxFilles |
| En Calcul, analyse, interprétations des indicateurs | tauxGF | tauxFilles |
| En Gestion d'une entité éducationnelle | tauxGF | tauxFilles |
| Planification | tauxGF | tauxFilles |

**GF** = Garçons + Filles (total)  
**F** = Filles uniquement

---

## 📌 Notes

- ✅ Tous les champs sont optionnels (default: 0)
- ✅ Compatible avec les rapports existants
- ✅ Aucune migration nécessaire
- ✅ Le frontend est déjà prêt

---

**Date:** 14 février 2026  
**Frontend:** Stanislas Makengo  
**Priorité:** HAUTE
