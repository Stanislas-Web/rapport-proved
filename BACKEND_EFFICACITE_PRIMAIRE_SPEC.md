# Spécification Backend : Efficacité Primaire (Section III.8)

## 📋 Problème Identifié

**Section concernée** : III.8 - A. NIVEAU PRIMAIRE (Primary Level)

### Structure Actuelle
Le backend ne retourne pas de données pour cette section (`null`).

### Structure Attendue par le Frontend
Le frontend attend **3 indicateurs** avec **2 taux** pour chaque :
- `tauxGF` : Taux Garçons + Filles (%)
- `tauxFilles` : Taux Filles uniquement (%)

## 🎯 Structure JSON Requise

```json
{
  "efficacitePrimaire": {
    "tauxAbandon": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "tauxReussite": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "tauxEchec": {
      "tauxGF": 0,
      "tauxFilles": 0
    }
  }
}
```

## 📊 Correspondance Tableau Frontend

| Ligne du Tableau Frontend | Clé JSON | Description |
|----------------------------|----------|-------------|
| Taux d'Abandon | `tauxAbandon` | Pourcentage d'élèves ayant abandonné le primaire |
| Taux de Réussite | `tauxReussite` | Pourcentage d'élèves ayant réussi le primaire |
| Taux d'Échec | `tauxEchec` | Pourcentage d'élèves ayant échoué le primaire |

## 💻 Implémentation Backend

### 1. Interface TypeScript

```typescript
interface EfficaciteIndicateur {
  tauxGF: number;      // Taux Garçons + Filles (0-100)
  tauxFilles: number;  // Taux Filles uniquement (0-100)
}

interface EfficacitePrimaire {
  tauxAbandon: EfficaciteIndicateur;
  tauxReussite: EfficaciteIndicateur;
  tauxEchec: EfficaciteIndicateur;
}

interface IndicateursRendement {
  rendementInterne: {
    sixiemePrimaire: { abandon: number; reussite: number; echec: number };
    huitiemeCETB: { abandon: number; reussite: number; echec: number };
    quatriemeHumanite: { abandon: number; reussite: number; echec: number };
    diplomesMathematiques: { abandon: number; reussite: number; echec: number };
    diplomesFiliereTechniques: { abandon: number; reussite: number; echec: number };
  };
  rendementExterne: {
    prescolaire: EfficaciteIndicateur;
    espaceCommunautaireEveil: EfficaciteIndicateur;
    classePreprimaire: EfficaciteIndicateur;
    maternel: EfficaciteIndicateur;
    primaire: EfficaciteIndicateur;
    enseignementSpecialPrimaire: EfficaciteIndicateur;
    enseignementPrimaire: EfficaciteIndicateur;
    secondaire: EfficaciteIndicateur;
    enseignementSpecialSecondaire: EfficaciteIndicateur;
    enseignementSecondaireNormal: EfficaciteIndicateur;
  };
  efficacitePrimaire: EfficacitePrimaire;
}
```

### 2. Mongoose Schema

```javascript
const EfficaciteIndicateurSchema = new mongoose.Schema({
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

const EfficacitePrimaireSchema = new mongoose.Schema({
  tauxAbandon: {
    type: EfficaciteIndicateurSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  tauxReussite: {
    type: EfficaciteIndicateurSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  tauxEchec: {
    type: EfficaciteIndicateurSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  }
}, { _id: false });

// Dans le schema principal
const IndicateursRendementSchema = new mongoose.Schema({
  rendementInterne: { /* ... voir BACKEND_RENDEMENT_INTERNE_SPEC.md */ },
  rendementExterne: { /* ... voir BACKEND_RENDEMENT_EXTERNE_SPEC.md */ },
  efficacitePrimaire: {
    type: EfficacitePrimaireSchema,
    default: () => ({})
  }
}, { _id: false });
```

### 3. Fonction de Validation

```javascript
function validateEfficacitePrimaire(data) {
  const indicateursRequis = ['tauxAbandon', 'tauxReussite', 'tauxEchec'];
  const errors = [];

  indicateursRequis.forEach(indicateur => {
    if (!data[indicateur]) {
      errors.push(`Indicateur manquant: ${indicateur}`);
      return;
    }

    const { tauxGF, tauxFilles } = data[indicateur];

    if (typeof tauxGF !== 'number' || tauxGF < 0 || tauxGF > 100) {
      errors.push(`${indicateur}.tauxGF invalide (doit être entre 0 et 100)`);
    }

    if (typeof tauxFilles !== 'number' || tauxFilles < 0 || tauxFilles > 100) {
      errors.push(`${indicateur}.tauxFilles invalide (doit être entre 0 et 100)`);
    }

    // Validation logique : taux filles ne peut pas dépasser taux GF
    if (tauxFilles > tauxGF) {
      errors.push(`${indicateur}: tauxFilles (${tauxFilles}) ne peut pas dépasser tauxGF (${tauxGF})`);
    }
  });

  // Validation logique : la somme des 3 taux devrait être environ 100%
  const sommeGF = data.tauxAbandon.tauxGF + data.tauxReussite.tauxGF + data.tauxEchec.tauxGF;
  if (Math.abs(sommeGF - 100) > 0.5) {
    errors.push(`La somme des taux GF (${sommeGF.toFixed(1)}%) devrait être proche de 100%`);
  }

  const sommeFilles = data.tauxAbandon.tauxFilles + data.tauxReussite.tauxFilles + data.tauxEchec.tauxFilles;
  if (Math.abs(sommeFilles - 100) > 0.5) {
    errors.push(`La somme des taux Filles (${sommeFilles.toFixed(1)}%) devrait être proche de 100%`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

## 📝 Exemple de Données Complètes

```json
{
  "ameliorationQualite": {
    "indicateursRendement": {
      "rendementInterne": { /* ... */ },
      "rendementExterne": { /* ... */ },
      "efficacitePrimaire": {
        "tauxAbandon": {
          "tauxGF": 5.2,
          "tauxFilles": 4.8
        },
        "tauxReussite": {
          "tauxGF": 87.9,
          "tauxFilles": 86.5
        },
        "tauxEchec": {
          "tauxGF": 6.9,
          "tauxFilles": 8.7
        }
      }
    }
  }
}
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
        "efficacitePrimaire": {
          "tauxAbandon": { "tauxGF": 5.2, "tauxFilles": 4.8 },
          "tauxReussite": { "tauxGF": 87.9, "tauxFilles": 86.5 },
          "tauxEchec": { "tauxGF": 6.9, "tauxFilles": 8.7 }
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
        "efficacitePrimaire": {
          "tauxAbandon": { "tauxGF": 5.2, "tauxFilles": 4.8 },
          "tauxReussite": { "tauxGF": 87.9, "tauxFilles": 86.5 },
          "tauxEchec": { "tauxGF": 6.9, "tauxFilles": 8.7 }
        }
      }
    }
  }'
```

### Test avec curl (GET - Vérification)

```bash
# Récupérer un rapport spécifique
curl -X GET "https://www.edu-nc.site/api/v1/rapport-activite/{RAPPORT_ID}" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.ameliorationQualite.indicateursRendement.efficacitePrimaire'
```

## 🔄 Relation avec les Autres Sections

### Note Importante sur la Cohérence des Données

Les **3 taux** de la section `efficacitePrimaire` devraient être **cohérents** avec les données de `rendementInterne` pour la ligne `sixiemePrimaire` :

| Section | Données |
|---------|---------|
| **III.4 - rendementInterne.sixiemePrimaire** | `{ abandon: 5.2, reussite: 87.9, echec: 6.9 }` |
| **III.8 - efficacitePrimaire** | `{ tauxAbandon: {tauxGF: 5.2}, tauxReussite: {tauxGF: 87.9}, tauxEchec: {tauxGF: 6.9} }` |

➡️ Les valeurs GF de `efficacitePrimaire` devraient correspondre aux valeurs de `rendementInterne.sixiemePrimaire`.

## ✅ Checklist d'Implémentation

- [ ] Créer le schema `EfficaciteIndicateurSchema`
- [ ] Créer le schema `EfficacitePrimaireSchema` avec les 3 indicateurs
- [ ] Mettre à jour le schema principal `IndicateursRendementSchema`
- [ ] Implémenter la fonction de validation `validateEfficacitePrimaire`
- [ ] Ajouter les validations dans les routes POST et PUT
- [ ] Tester avec curl (POST, PUT, GET)
- [ ] Vérifier que le frontend charge correctement les données
- [ ] Vérifier la cohérence avec `rendementInterne.sixiemePrimaire`
- [ ] Documenter les changements dans le CHANGELOG

## 📝 Notes Importantes

1. **Valeurs par défaut** : Tous les taux sont initialisés à `0` par défaut
2. **Validation logique** : 
   - `tauxFilles` ≤ `tauxGF` (les filles sont incluses dans GF)
   - `tauxAbandon + tauxReussite + tauxEchec ≈ 100%`
3. **Plage de valeurs** : Les taux doivent être entre 0 et 100 (pourcentages)
4. **Structure obligatoire** : Les 3 indicateurs doivent être présents dans la réponse
5. **Cohérence** : Les valeurs GF devraient correspondre à `rendementInterne.sixiemePrimaire`

## 🔗 Références

- **Frontend** : `src/pages/RapportActivite/components/EvaluationQualitativeComplete.tsx` (lignes 298-320)
- **Section** : III.8 - A. NIVEAU PRIMAIRE (Primary Level)
- **Spécifications liées** : 
  - `BACKEND_RENDEMENT_INTERNE_SPEC.md`
  - `BACKEND_RENDEMENT_EXTERNE_SPEC.md`
