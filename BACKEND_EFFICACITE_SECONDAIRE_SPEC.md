# Spécification Backend : Efficacité Secondaire (Section III.8)

## 📋 Problème Identifié

**Section concernée** : III.8 - B. NIVEAU SECONDAIRE (Secondary Level)

### Structure Actuelle
Le backend ne retourne pas de données pour cette section (`null`).

### Structure Attendue par le Frontend
Le frontend attend **3 indicateurs** avec **2 taux** pour chaque :
- `tauxGF` : Taux Garçons + Filles (%)
- `tauxFilles` : Taux Filles uniquement (%)

## 🎯 Structure JSON Requise

```json
{
  "efficaciteSecondaire": {
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
| Taux d'Abandon | `tauxAbandon` | Pourcentage d'élèves ayant abandonné le secondaire |
| Taux de Réussite | `tauxReussite` | Pourcentage d'élèves ayant réussi le secondaire |
| Taux d'Échec | `tauxEchec` | Pourcentage d'élèves ayant échoué le secondaire |

## 💻 Implémentation Backend

### 1. Interface TypeScript

```typescript
interface EfficaciteIndicateur {
  tauxGF: number;      // Taux Garçons + Filles (0-100)
  tauxFilles: number;  // Taux Filles uniquement (0-100)
}

interface EfficaciteSecondaire {
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
  efficaciteSecondaire: EfficaciteSecondaire;  // NOUVELLE SECTION
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

const EfficaciteSecondaireSchema = new mongoose.Schema({
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
  efficacitePrimaire: { /* ... voir BACKEND_EFFICACITE_PRIMAIRE_SPEC.md */ },
  efficaciteSecondaire: {
    type: EfficaciteSecondaireSchema,
    default: () => ({
      tauxAbandon: { tauxGF: 0, tauxFilles: 0 },
      tauxReussite: { tauxGF: 0, tauxFilles: 0 },
      tauxEchec: { tauxGF: 0, tauxFilles: 0 }
    })
  }
}, { _id: false });
```

### 3. Fonction de Validation

```javascript
function validateEfficaciteSecondaire(data) {
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
      "efficacitePrimaire": { /* ... */ },
      "efficaciteSecondaire": {
        "tauxAbandon": {
          "tauxGF": 6.8,
          "tauxFilles": 6.2
        },
        "tauxReussite": {
          "tauxGF": 84.7,
          "tauxFilles": 83.1
        },
        "tauxEchec": {
          "tauxGF": 8.5,
          "tauxFilles": 10.7
        }
      }
    }
  }
}
```

## 🧪 Tests cURL

### 1. Créer un Rapport avec efficaciteSecondaire

```bash
curl -X POST http://localhost:5000/api/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "annee": "2024-2025",
    "identificationProved": "6970af4de0355a44bca8a5b9",
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 6.8, "tauxFilles": 6.2 },
          "tauxReussite": { "tauxGF": 84.7, "tauxFilles": 83.1 },
          "tauxEchec": { "tauxGF": 8.5, "tauxFilles": 10.7 }
        }
      }
    }
  }'
```

### 2. Mettre à Jour efficaciteSecondaire

```bash
curl -X PUT http://localhost:5000/api/rapport-activite/$RAPPORT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 7.2, "tauxFilles": 6.8 },
          "tauxReussite": { "tauxGF": 83.5, "tauxFilles": 81.9 },
          "tauxEchec": { "tauxGF": 9.3, "tauxFilles": 11.3 }
        }
      }
    }
  }'
```

### 3. Récupérer et Vérifier

```bash
curl -X GET http://localhost:5000/api/rapport-activite/$RAPPORT_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.data.ameliorationQualite.indicateursRendement.efficaciteSecondaire'
```

## 🔗 Cohérence avec rendementInterne

Les **3 taux** de la section `efficaciteSecondaire` devraient être **cohérents** avec les données agrégées du `rendementInterne` pour les niveaux secondaires (`huitiemeCETB`, `quatriemeHumanite`, `diplomesMathematiques`, `diplomesFiliereTechniques`) :

| **Section** | **Exemple de Valeurs** |
|-------------|------------------------|
| **III.7 - rendementInterne** | `{ huitiemeCETB: {abandon: 6.8, reussite: 84.7, echec: 8.5}, ... }` |
| **III.8 - efficaciteSecondaire** | `{ tauxAbandon: {tauxGF: 6.8}, tauxReussite: {tauxGF: 84.7}, tauxEchec: {tauxGF: 8.5} }` |

➡️ Les valeurs GF de `efficaciteSecondaire` devraient correspondre aux moyennes pondérées des niveaux secondaires de `rendementInterne`.

## ✅ Checklist d'Implémentation

- [ ] Créer le schema `EfficaciteSecondaireSchema` avec les 3 indicateurs
- [ ] Ajouter `efficaciteSecondaire` dans `IndicateursRendementSchema`
- [ ] Implémenter la fonction de validation `validateEfficaciteSecondaire`
- [ ] Mettre à jour le controller pour accepter ces données en CREATE/UPDATE
- [ ] Ajouter des tests unitaires pour la validation
- [ ] Tester l'intégration complète avec le frontend
- [ ] Vérifier la cohérence avec `rendementInterne`
- [ ] Documenter dans le README principal

## 🐛 Points d'Attention

1. **Valeurs par défaut** : Tous les taux doivent être initialisés à 0
2. **Validation de somme** : `tauxAbandon + tauxReussite + tauxEchec ≈ 100%`
3. **Cohérence logique** : `tauxFilles ≤ tauxGF` pour chaque indicateur
4. **Optionnalité** : Le champ doit être optionnel (pas obligatoire à la création)
5. **Rétrocompatibilité** : Les rapports existants sans ce champ doivent continuer à fonctionner
