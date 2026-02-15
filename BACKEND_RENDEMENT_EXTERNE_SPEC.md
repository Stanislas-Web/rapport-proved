# Spécification Backend : Rendement Externe (Section III.5)

## 📋 Problème Identifié

**Section concernée** : III.5. Quelques Indicateurs du Rendement Externes (Examens certificatifs)

### Structure Actuelle (INCORRECTE)
```json
{
  "rendementExterne": {
    "examensCertificatifs": {
      "tauxDiplomes": 80.3,
      "tauxHumanitesScientifiques": 84.6,
      "tauxHumanitesTechniques": 76.2
    }
  }
}
```

### Structure Attendue par le Frontend (CORRECTE)
Le frontend attend **10 niveaux d'enseignement** avec **2 taux** pour chaque :
- `tauxGF` : Taux Garçons + Filles (%)
- `tauxFilles` : Taux Filles uniquement (%)

## 🎯 Nouvelle Structure JSON Requise

```json
{
  "rendementExterne": {
    "prescolaire": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "espaceCommunautaireEveil": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "classePreprimaire": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "maternel": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "primaire": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "enseignementSpecialPrimaire": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "enseignementPrimaire": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "secondaire": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "enseignementSpecialSecondaire": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "enseignementSecondaireNormal": {
      "tauxGF": 0,
      "tauxFilles": 0
    }
  }
}
```

## 📊 Correspondance Tableau Frontend

| Ligne du Tableau Frontend | Clé JSON | Description |
|----------------------------|----------|-------------|
| A. NIVEAU PRESCOLAIRE | `prescolaire` | Taux de réussite général préscolaire |
| a) Espace Communautaire d'Eveil | `espaceCommunautaireEveil` | ECE |
| b) Classe Préprimaire | `classePreprimaire` | Préprimaire |
| c) Maternelle | `maternel` | Maternelle |
| B. NIVEAU PRIMAIRE | `primaire` | Taux de réussite général primaire |
| a) Enseignement Spécial | `enseignementSpecialPrimaire` | Primaire spécial |
| b) Enseignement Primaire | `enseignementPrimaire` | Primaire normal |
| C. NIVEAU SECONDAIRE | `secondaire` | Taux de réussite général secondaire |
| a) Enseignement Spécial | `enseignementSpecialSecondaire` | Secondaire spécial |
| b) Enseignement Secondaire Normal | `enseignementSecondaireNormal` | Secondaire normal |

## 💻 Implémentation Backend

### 1. Interface TypeScript

```typescript
interface RendementExterneNiveau {
  tauxGF: number;      // Taux de réussite Garçons + Filles (0-100)
  tauxFilles: number;  // Taux de réussite Filles uniquement (0-100)
}

interface RendementExterne {
  prescolaire: RendementExterneNiveau;
  espaceCommunautaireEveil: RendementExterneNiveau;
  classePreprimaire: RendementExterneNiveau;
  maternel: RendementExterneNiveau;
  primaire: RendementExterneNiveau;
  enseignementSpecialPrimaire: RendementExterneNiveau;
  enseignementPrimaire: RendementExterneNiveau;
  secondaire: RendementExterneNiveau;
  enseignementSpecialSecondaire: RendementExterneNiveau;
  enseignementSecondaireNormal: RendementExterneNiveau;
}

interface IndicateursRendement {
  rendementInterne: {
    sixiemePrimaire: { abandon: number; reussite: number; echec: number };
    huitiemeCETB: { abandon: number; reussite: number; echec: number };
    quatriemeHumanite: { abandon: number; reussite: number; echec: number };
    diplomesMathematiques: { abandon: number; reussite: number; echec: number };
    diplomesFiliereTechniques: { abandon: number; reussite: number; echec: number };
  };
  rendementExterne: RendementExterne;
}
```

### 2. Mongoose Schema

```javascript
const RendementExterneNiveauSchema = new mongoose.Schema({
  tauxGF: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tauxFilles: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, { _id: false });

const RendementExterneSchema = new mongoose.Schema({
  prescolaire: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  espaceCommunautaireEveil: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  classePreprimaire: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  maternel: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  primaire: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  enseignementSpecialPrimaire: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  enseignementPrimaire: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  secondaire: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  enseignementSpecialSecondaire: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  enseignementSecondaireNormal: {
    type: RendementExterneNiveauSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  }
}, { _id: false });

// Dans le schema principal
const IndicateursRendementSchema = new mongoose.Schema({
  rendementInterne: { /* ... voir BACKEND_RENDEMENT_INTERNE_SPEC.md */ },
  rendementExterne: {
    type: RendementExterneSchema,
    default: () => ({})
  }
}, { _id: false });
```

### 3. Fonction de Validation

```javascript
function validateRendementExterne(data) {
  const niveauxRequis = [
    'prescolaire',
    'espaceCommunautaireEveil',
    'classePreprimaire',
    'maternel',
    'primaire',
    'enseignementSpecialPrimaire',
    'enseignementPrimaire',
    'secondaire',
    'enseignementSpecialSecondaire',
    'enseignementSecondaireNormal'
  ];

  const errors = [];

  niveauxRequis.forEach(niveau => {
    if (!data[niveau]) {
      errors.push(`Niveau manquant: ${niveau}`);
      return;
    }

    const { tauxGF, tauxFilles } = data[niveau];

    if (typeof tauxGF !== 'number' || tauxGF < 0 || tauxGF > 100) {
      errors.push(`${niveau}.tauxGF invalide (doit être entre 0 et 100)`);
    }

    if (typeof tauxFilles !== 'number' || tauxFilles < 0 || tauxFilles > 100) {
      errors.push(`${niveau}.tauxFilles invalide (doit être entre 0 et 100)`);
    }

    // Validation logique : taux filles ne peut pas dépasser taux GF
    if (tauxFilles > tauxGF) {
      errors.push(`${niveau}: tauxFilles (${tauxFilles}) ne peut pas dépasser tauxGF (${tauxGF})`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
```

## 🔄 Migration des Données Existantes

### Avant (Structure Actuelle)
```json
{
  "examensCertificatifs": {
    "tauxDiplomes": 80.3,
    "tauxHumanitesScientifiques": 84.6,
    "tauxHumanitesTechniques": 76.2
  }
}
```

### Après (Nouvelle Structure)
```json
{
  "prescolaire": { "tauxGF": 0, "tauxFilles": 0 },
  "espaceCommunautaireEveil": { "tauxGF": 0, "tauxFilles": 0 },
  "classePreprimaire": { "tauxGF": 0, "tauxFilles": 0 },
  "maternel": { "tauxGF": 0, "tauxFilles": 0 },
  "primaire": { "tauxGF": 0, "tauxFilles": 0 },
  "enseignementSpecialPrimaire": { "tauxGF": 0, "tauxFilles": 0 },
  "enseignementPrimaire": { "tauxGF": 0, "tauxFilles": 0 },
  "secondaire": { "tauxGF": 0, "tauxFilles": 0 },
  "enseignementSpecialSecondaire": { "tauxGF": 0, "tauxFilles": 0 },
  "enseignementSecondaireNormal": { "tauxGF": 0, "tauxFilles": 0 }
}
```

### Script de Migration MongoDB

```javascript
// Script de migration pour transformer l'ancienne structure
db.rapports.updateMany(
  { "ameliorationQualite.indicateursRendement.rendementExterne.examensCertificatifs": { $exists: true } },
  [
    {
      $set: {
        "ameliorationQualite.indicateursRendement.rendementExterne": {
          prescolaire: { tauxGF: 0, tauxFilles: 0 },
          espaceCommunautaireEveil: { tauxGF: 0, tauxFilles: 0 },
          classePreprimaire: { tauxGF: 0, tauxFilles: 0 },
          maternel: { tauxGF: 0, tauxFilles: 0 },
          primaire: { tauxGF: 0, tauxFilles: 0 },
          enseignementSpecialPrimaire: { tauxGF: 0, tauxFilles: 0 },
          enseignementPrimaire: { tauxGF: 0, tauxFilles: 0 },
          secondaire: { tauxGF: 0, tauxFilles: 0 },
          enseignementSpecialSecondaire: { tauxGF: 0, tauxFilles: 0 },
          enseignementSecondaireNormal: { tauxGF: 0, tauxFilles: 0 }
        }
      }
    }
  ]
);
```

## 🧪 Tests

### Test avec curl (POST - Création)

```bash
curl -X POST "https://www.edu-nc.site/api/v1/rapport-activite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ameliorationQualite": {
      "indicateursRendement": {
        "rendementExterne": {
          "prescolaire": { "tauxGF": 85.5, "tauxFilles": 82.3 },
          "espaceCommunautaireEveil": { "tauxGF": 78.2, "tauxFilles": 75.8 },
          "classePreprimaire": { "tauxGF": 88.1, "tauxFilles": 86.4 },
          "maternel": { "tauxGF": 90.3, "tauxFilles": 89.2 },
          "primaire": { "tauxGF": 87.9, "tauxFilles": 85.6 },
          "enseignementSpecialPrimaire": { "tauxGF": 72.5, "tauxFilles": 70.1 },
          "enseignementPrimaire": { "tauxGF": 89.2, "tauxFilles": 87.3 },
          "secondaire": { "tauxGF": 84.7, "tauxFilles": 81.9 },
          "enseignementSpecialSecondaire": { "tauxGF": 68.3, "tauxFilles": 65.2 },
          "enseignementSecondaireNormal": { "tauxGF": 86.5, "tauxFilles": 83.8 }
        }
      }
    }
  }'
```

### Test avec curl (PUT - Mise à jour)

```bash
curl -X PUT "https://www.edu-nc.site/api/v1/rapport-activite/{RAPPORT_ID}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ameliorationQualite": {
      "indicateursRendement": {
        "rendementExterne": {
          "prescolaire": { "tauxGF": 85.5, "tauxFilles": 82.3 },
          "espaceCommunautaireEveil": { "tauxGF": 78.2, "tauxFilles": 75.8 },
          "classePreprimaire": { "tauxGF": 88.1, "tauxFilles": 86.4 },
          "maternel": { "tauxGF": 90.3, "tauxFilles": 89.2 },
          "primaire": { "tauxGF": 87.9, "tauxFilles": 85.6 },
          "enseignementSpecialPrimaire": { "tauxGF": 72.5, "tauxFilles": 70.1 },
          "enseignementPrimaire": { "tauxGF": 89.2, "tauxFilles": 87.3 },
          "secondaire": { "tauxGF": 84.7, "tauxFilles": 81.9 },
          "enseignementSpecialSecondaire": { "tauxGF": 68.3, "tauxFilles": 65.2 },
          "enseignementSecondaireNormal": { "tauxGF": 86.5, "tauxFilles": 83.8 }
        }
      }
    }
  }'
```

### Test avec curl (GET - Vérification)

```bash
# Récupérer un rapport spécifique
curl -X GET "https://www.edu-nc.site/api/v1/rapport-activite/{RAPPORT_ID}" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.ameliorationQualite.indicateursRendement.rendementExterne'
```

## ✅ Checklist d'Implémentation

- [ ] Supprimer l'ancienne structure `examensCertificatifs`
- [ ] Créer le nouveau schema `RendementExterneNiveauSchema`
- [ ] Créer le schema `RendementExterneSchema` avec les 10 niveaux
- [ ] Mettre à jour le schema principal `IndicateursRendementSchema`
- [ ] Implémenter la fonction de validation `validateRendementExterne`
- [ ] Ajouter les validations dans les routes POST et PUT
- [ ] Exécuter le script de migration sur les données existantes
- [ ] Tester avec curl (POST, PUT, GET)
- [ ] Vérifier que le frontend charge correctement les données
- [ ] Documenter les changements dans le CHANGELOG

## 📝 Notes Importantes

1. **Valeurs par défaut** : Tous les taux sont initialisés à `0` par défaut
2. **Validation logique** : `tauxFilles` ≤ `tauxGF` (les filles sont incluses dans GF)
3. **Plage de valeurs** : Les taux doivent être entre 0 et 100 (pourcentages)
4. **Structure obligatoire** : Les 10 niveaux doivent être présents dans la réponse
5. **Compatibilité** : Cette structure remplace complètement `examensCertificatifs`

## 🔗 Références

- **Frontend** : `src/pages/RapportActivite/components/EvaluationQualitativeComplete.tsx` (lignes 194-240)
- **Section** : III.5. Quelques Indicateurs du Rendement Externes (Examens certificatifs)
- **Spécification Rendement Interne** : Voir `BACKEND_RENDEMENT_INTERNE_SPEC.md`
