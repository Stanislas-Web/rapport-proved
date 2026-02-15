# Spécification Backend - III.4 Indicateurs du Rendement Interne

## 🎯 Contexte

Le tableau **III.4. Quelques Indicateurs du Rendement Interne** affiche **5 lignes** dans le frontend :

| Ligne | Label Frontend | Clé dans le code |
|-------|----------------|------------------|
| A | 6ème Primaire | `sixiemePrimaire` |
| B | 8ème CETB | `huitiemeCETB` |
| C | 4ème Humanité | `quatriemeHumanite` |
| D | Proportion des diplômés en Mathématiques | `diplomesMathematiques` |
| E | Proportion des Diplômés des Filières Techniques | `diplomesFiliereTechniques` |

Chaque ligne contient 3 valeurs : `% D'ABANDON`, `% DE REUSSITE`, `% D'ECHEC`

---

## 📊 Structure Attendue par le Frontend

Le backend doit envoyer les données sous cette structure :

```json
{
  "ameliorationQualite": {
    "indicateursRendement": {
      "rendementInterne": {
        "sixiemePrimaire": {
          "abandon": 5.2,
          "reussite": 87.9,
          "echec": 6.9
        },
        "huitiemeCETB": {
          "abandon": 6.8,
          "reussite": 84.7,
          "echec": 8.5
        },
        "quatriemeHumanite": {
          "abandon": 6.5,
          "reussite": 85.2,
          "echec": 8.3
        },
        "diplomesMathematiques": {
          "abandon": 4.2,
          "reussite": 88.5,
          "echec": 7.3
        },
        "diplomesFiliereTechniques": {
          "abandon": 5.8,
          "reussite": 86.1,
          "echec": 8.1
        }
      }
    }
  }
}
```

---

## ✅ Validation des Données

### Règles métier :
- Tous les taux sont des **nombres décimaux** (float)
- Les valeurs doivent être **entre 0 et 100** (pourcentages)
- Idéalement : `abandon + reussite + echec = 100%` (mais pas strictement obligatoire)
- Chaque niveau **DOIT** avoir les 3 champs : `abandon`, `reussite`, `echec`

### Structure TypeScript (pour référence) :
```typescript
interface RendementInterneNiveau {
  abandon: number;    // Taux d'abandon en %
  reussite: number;   // Taux de réussite en %
  echec: number;      // Taux d'échec en %
}

interface RendementInterne {
  sixiemePrimaire: RendementInterneNiveau;
  huitiemeCETB: RendementInterneNiveau;
  quatriemeHumanite: RendementInterneNiveau;
  diplomesMathematiques: RendementInterneNiveau;
  diplomesFiliereTechniques: RendementInterneNiveau;
}
```

---

## 🔄 Migration depuis l'ancienne structure

### ⚠️ Ancienne structure (à NE PLUS utiliser) :
```json
{
  "rendementInterne": {
    "prescolaire": { "tauxAbandon": 2.8, "tauxReussite": 93.5, "tauxEchec": 3.7 },
    "primaire": { "tauxAbandon": 5.2, "tauxReussite": 87.9, "tauxEchec": 6.9 },
    "secondaire": { "tauxAbandon": 6.8, "tauxReussite": 84.7, "tauxEchec": 8.5 }
  }
}
```

### ✅ Nouvelle structure (à utiliser) :
```json
{
  "rendementInterne": {
    "sixiemePrimaire": { "abandon": 5.2, "reussite": 87.9, "echec": 6.9 },
    "huitiemeCETB": { "abandon": 6.8, "reussite": 84.7, "echec": 8.5 },
    "quatriemeHumanite": { "abandon": 6.5, "reussite": 85.2, "echec": 8.3 },
    "diplomesMathematiques": { "abandon": 4.2, "reussite": 88.5, "echec": 7.3 },
    "diplomesFiliereTechniques": { "abandon": 5.8, "reussite": 86.1, "echec": 8.1 }
  }
}
```

**Différences clés :**
1. ❌ Supprimer `prescolaire` (non utilisé)
2. ✅ Ajouter 5 niveaux spécifiques
3. ✅ Renommer les champs : `tauxAbandon` → `abandon`, `tauxReussite` → `reussite`, `tauxEchec` → `echec`

---

## 📝 Exemple de données réelles

```json
{
  "rendementInterne": {
    "sixiemePrimaire": {
      "abandon": 5.2,
      "reussite": 87.9,
      "echec": 6.9
    },
    "huitiemeCETB": {
      "abandon": 6.8,
      "reussite": 84.7,
      "echec": 8.5
    },
    "quatriemeHumanite": {
      "abandon": 6.5,
      "reussite": 85.2,
      "echec": 8.3
    },
    "diplomesMathematiques": {
      "abandon": 4.2,
      "reussite": 88.5,
      "echec": 7.3
    },
    "diplomesFiliereTechniques": {
      "abandon": 5.8,
      "reussite": 86.1,
      "echec": 8.1
    }
  }
}
```

---

## 🧪 Test de validation

### Commande cURL pour tester :
```bash
TOKEN="votre_token_jwt"
RAPPORT_ID="votre_rapport_id"

curl -X GET "https://www.edu-nc.site/api/v1/rapport-activite/$RAPPORT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.ameliorationQualite.indicateursRendement.rendementInterne'
```

### Résultat attendu :
```json
{
  "sixiemePrimaire": { "abandon": 5.2, "reussite": 87.9, "echec": 6.9 },
  "huitiemeCETB": { "abandon": 6.8, "reussite": 84.7, "echec": 8.5 },
  "quatriemeHumanite": { "abandon": 6.5, "reussite": 85.2, "echec": 8.3 },
  "diplomesMathematiques": { "abandon": 4.2, "reussite": 88.5, "echec": 7.3 },
  "diplomesFiliereTechniques": { "abandon": 5.8, "reussite": 86.1, "echec": 8.1 }
}
```

---

## 🔧 Modifications Backend à effectuer

### 1. Schéma MongoDB (Mongoose)

```javascript
const rendementInterneSchema = new mongoose.Schema({
  sixiemePrimaire: {
    abandon: { type: Number, min: 0, max: 100, default: 0 },
    reussite: { type: Number, min: 0, max: 100, default: 0 },
    echec: { type: Number, min: 0, max: 100, default: 0 }
  },
  huitiemeCETB: {
    abandon: { type: Number, min: 0, max: 100, default: 0 },
    reussite: { type: Number, min: 0, max: 100, default: 0 },
    echec: { type: Number, min: 0, max: 100, default: 0 }
  },
  quatriemeHumanite: {
    abandon: { type: Number, min: 0, max: 100, default: 0 },
    reussite: { type: Number, min: 0, max: 100, default: 0 },
    echec: { type: Number, min: 0, max: 100, default: 0 }
  },
  diplomesMathematiques: {
    abandon: { type: Number, min: 0, max: 100, default: 0 },
    reussite: { type: Number, min: 0, max: 100, default: 0 },
    echec: { type: Number, min: 0, max: 100, default: 0 }
  },
  diplomesFiliereTechniques: {
    abandon: { type: Number, min: 0, max: 100, default: 0 },
    reussite: { type: Number, min: 0, max: 100, default: 0 },
    echec: { type: Number, min: 0, max: 100, default: 0 }
  }
});
```

### 2. Validation côté backend

```javascript
function validateRendementInterne(data) {
  const niveaux = [
    'sixiemePrimaire',
    'huitiemeCETB',
    'quatriemeHumanite',
    'diplomesMathematiques',
    'diplomesFiliereTechniques'
  ];
  
  const champs = ['abandon', 'reussite', 'echec'];
  
  for (const niveau of niveaux) {
    if (!data[niveau]) {
      return { valid: false, message: `Niveau ${niveau} manquant` };
    }
    
    for (const champ of champs) {
      const valeur = data[niveau][champ];
      if (typeof valeur !== 'number' || valeur < 0 || valeur > 100) {
        return { 
          valid: false, 
          message: `${niveau}.${champ} doit être un nombre entre 0 et 100` 
        };
      }
    }
  }
  
  return { valid: true };
}
```

---

## 📋 Checklist de mise à jour

- [ ] Mettre à jour le schéma MongoDB
- [ ] Ajouter les 5 niveaux (sixiemePrimaire, huitiemeCETB, etc.)
- [ ] Renommer les champs (tauxAbandon → abandon, etc.)
- [ ] Supprimer le niveau "prescolaire" (non utilisé)
- [ ] Mettre à jour les validations backend
- [ ] Tester avec curl
- [ ] Migrer les données existantes (si nécessaire)
- [ ] Mettre à jour la documentation API

---

## 🚀 Impact

Une fois le backend mis à jour avec cette structure, le tableau III.4 dans le frontend affichera automatiquement les données correctes pour les 5 lignes, avec chargement depuis la base de données en mode modification.

---

## ❓ Questions ?

Contactez l'équipe frontend pour toute clarification sur la structure attendue.
