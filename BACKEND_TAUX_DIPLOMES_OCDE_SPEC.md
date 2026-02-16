# Spécification Backend : Taux de Diplômés OCDE (Section III.8)

## 📋 Problème Identifié

**Section concernée** : III.8 - C. TAUX DE DIPLÔMÉS SELON NORME OCDE

### Structure Actuelle
Le backend ne retourne pas de données pour cette section (`null`).

### Structure Attendue par le Frontend
Le frontend attend **2 filières** avec **2 taux** pour chaque :
- `tauxGF` : Taux Garçons + Filles (%)
- `tauxFilles` : Taux Filles uniquement (%)

## 🎯 Structure JSON Requise

```json
{
  "tauxDiplomesOCDE": {
    "humanitesScientifiques": {
      "tauxGF": 0,
      "tauxFilles": 0
    },
    "humanitesTechniques": {
      "tauxGF": 0,
      "tauxFilles": 0
    }
  }
}
```

## 📊 Correspondance Tableau Frontend

| Ligne du Tableau Frontend | Clé JSON | Description |
|----------------------------|----------|-------------|
| Taux de diplômés des humanités scientifiques | `humanitesScientifiques` | Pourcentage de diplômés en sciences |
| Taux de diplômés des humanités techniques | `humanitesTechniques` | Pourcentage de diplômés en filière technique |

## 💻 Implémentation Backend

### 1. Interface TypeScript

```typescript
interface TauxDiplomesIndicateur {
  tauxGF: number;      // Taux Garçons + Filles (0-100)
  tauxFilles: number;  // Taux Filles uniquement (0-100)
}

interface TauxDiplomesOCDE {
  humanitesScientifiques: TauxDiplomesIndicateur;
  humanitesTechniques: TauxDiplomesIndicateur;
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
    prescolaire: TauxDiplomesIndicateur;
    espaceCommunautaireEveil: TauxDiplomesIndicateur;
    classePreprimaire: TauxDiplomesIndicateur;
    maternel: TauxDiplomesIndicateur;
    primaire: TauxDiplomesIndicateur;
    enseignementSpecialPrimaire: TauxDiplomesIndicateur;
    enseignementPrimaire: TauxDiplomesIndicateur;
    secondaire: TauxDiplomesIndicateur;
    enseignementSpecialSecondaire: TauxDiplomesIndicateur;
    enseignementSecondaireNormal: TauxDiplomesIndicateur;
  };
  efficacitePrimaire: EfficacitePrimaire;
  efficaciteSecondaire: EfficaciteSecondaire;
  tauxDiplomesOCDE: TauxDiplomesOCDE;  // NOUVELLE SECTION
}
```

### 2. Mongoose Schema

```javascript
const TauxDiplomesIndicateurSchema = new mongoose.Schema({
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

const TauxDiplomesOCDESchema = new mongoose.Schema({
  humanitesScientifiques: {
    type: TauxDiplomesIndicateurSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  humanitesTechniques: {
    type: TauxDiplomesIndicateurSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  }
}, { _id: false });

// Dans le schema principal
const IndicateursRendementSchema = new mongoose.Schema({
  rendementInterne: { /* ... voir BACKEND_RENDEMENT_INTERNE_SPEC.md */ },
  rendementExterne: { /* ... voir BACKEND_RENDEMENT_EXTERNE_SPEC.md */ },
  efficacitePrimaire: { /* ... voir BACKEND_EFFICACITE_PRIMAIRE_SPEC.md */ },
  efficaciteSecondaire: { /* ... voir BACKEND_EFFICACITE_SECONDAIRE_SPEC.md */ },
  tauxDiplomesOCDE: {
    type: TauxDiplomesOCDESchema,
    default: () => ({
      humanitesScientifiques: { tauxGF: 0, tauxFilles: 0 },
      humanitesTechniques: { tauxGF: 0, tauxFilles: 0 }
    })
  }
}, { _id: false });
```

### 3. Fonction de Validation

```javascript
function validateTauxDiplomesOCDE(data) {
  const filieresRequises = ['humanitesScientifiques', 'humanitesTechniques'];
  const errors = [];

  filieresRequises.forEach(filiere => {
    if (!data[filiere]) {
      errors.push(`Filière manquante: ${filiere}`);
      return;
    }

    const { tauxGF, tauxFilles } = data[filiere];

    if (typeof tauxGF !== 'number' || tauxGF < 0 || tauxGF > 100) {
      errors.push(`${filiere}.tauxGF invalide (doit être entre 0 et 100)`);
    }

    if (typeof tauxFilles !== 'number' || tauxFilles < 0 || tauxFilles > 100) {
      errors.push(`${filiere}.tauxFilles invalide (doit être entre 0 et 100)`);
    }

    // Validation logique : taux filles ne peut pas dépasser taux GF
    if (tauxFilles > tauxGF) {
      errors.push(`${filiere}: tauxFilles (${tauxFilles}) ne peut pas dépasser tauxGF (${tauxGF})`);
    }
  });

  // Validation métier : la somme des 2 filières pourrait être validée selon les règles métier
  // Par exemple, si on attend que tous les diplômés soient dans l'une de ces 2 catégories
  const sommeGF = data.humanitesScientifiques.tauxGF + data.humanitesTechniques.tauxGF;
  if (sommeGF > 100) {
    errors.push(`La somme des taux GF (${sommeGF.toFixed(1)}%) ne peut pas dépasser 100%`);
  }

  const sommeFilles = data.humanitesScientifiques.tauxFilles + data.humanitesTechniques.tauxFilles;
  if (sommeFilles > 100) {
    errors.push(`La somme des taux Filles (${sommeFilles.toFixed(1)}%) ne peut pas dépasser 100%`);
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
      "efficaciteSecondaire": { /* ... */ },
      "tauxDiplomesOCDE": {
        "humanitesScientifiques": {
          "tauxGF": 88.5,
          "tauxFilles": 86.2
        },
        "humanitesTechniques": {
          "tauxGF": 86.1,
          "tauxFilles": 82.4
        }
      }
    }
  }
}
```

## 🧪 Tests cURL

### 1. Créer un Rapport avec tauxDiplomesOCDE

```bash
curl -X POST http://localhost:5000/api/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "annee": "2024-2025",
    "identificationProved": "6970af4de0355a44bca8a5b9",
    "ameliorationQualite": {
      "indicateursRendement": {
        "tauxDiplomesOCDE": {
          "humanitesScientifiques": { "tauxGF": 88.5, "tauxFilles": 86.2 },
          "humanitesTechniques": { "tauxGF": 86.1, "tauxFilles": 82.4 }
        }
      }
    }
  }'
```

### 2. Mettre à Jour tauxDiplomesOCDE

```bash
curl -X PUT http://localhost:5000/api/rapport-activite/$RAPPORT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ameliorationQualite": {
      "indicateursRendement": {
        "tauxDiplomesOCDE": {
          "humanitesScientifiques": { "tauxGF": 89.2, "tauxFilles": 87.1 },
          "humanitesTechniques": { "tauxGF": 87.3, "tauxFilles": 83.8 }
        }
      }
    }
  }'
```

### 3. Récupérer et Vérifier

```bash
curl -X GET http://localhost:5000/api/rapport-activite/$RAPPORT_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.data.ameliorationQualite.indicateursRendement.tauxDiplomesOCDE'
```

## 🔗 Cohérence avec rendementInterne

Les **taux de diplômés** de la section `tauxDiplomesOCDE` devraient être **cohérents** avec les données de `rendementInterne` pour :
- `diplomesMathematiques` (correspond généralement aux humanités scientifiques)
- `diplomesFiliereTechniques` (correspond aux humanités techniques)

| **Section** | **Exemple de Valeurs** |
|-------------|------------------------|
| **III.7 - rendementInterne** | `{ diplomesMathematiques: {reussite: 88.5}, diplomesFiliereTechniques: {reussite: 86.1} }` |
| **III.8 - tauxDiplomesOCDE** | `{ humanitesScientifiques: {tauxGF: 88.5}, humanitesTechniques: {tauxGF: 86.1} }` |

➡️ Les taux de réussite dans `rendementInterne` devraient être cohérents avec les taux de diplômés dans `tauxDiplomesOCDE`.

## 📐 Calcul des Taux selon la Norme OCDE

Selon la classification OCDE (Organisation de Coopération et de Développement Économiques) :

### Formule de Calcul :

```
Taux de diplômés (filière X) = (Nombre de diplômés filière X / Nombre total de finalistes) × 100
```

### Exemple de Calcul :

**Données de base** :
- Total finalistes : 1000 élèves (580 garçons, 420 filles)
- Diplômés Humanités Scientifiques : 350 (200 garçons, 150 filles)
- Diplômés Humanités Techniques : 280 (180 garçons, 100 filles)

**Calculs** :
```
Humanités Scientifiques :
  - tauxGF = (350 / 1000) × 100 = 35%
  - tauxFilles = (150 / 420) × 100 = 35.7%

Humanités Techniques :
  - tauxGF = (280 / 1000) × 100 = 28%
  - tauxFilles = (100 / 420) × 100 = 23.8%
```

## ✅ Checklist d'Implémentation

- [ ] Créer le schema `TauxDiplomesOCDESchema` avec les 2 filières
- [ ] Ajouter `tauxDiplomesOCDE` dans `IndicateursRendementSchema`
- [ ] Implémenter la fonction de validation `validateTauxDiplomesOCDE`
- [ ] Mettre à jour le controller pour accepter ces données en CREATE/UPDATE
- [ ] Ajouter des tests unitaires pour la validation
- [ ] Tester l'intégration complète avec le frontend
- [ ] Vérifier la cohérence avec `rendementInterne.diplomesMathematiques` et `diplomesFiliereTechniques`
- [ ] Documenter dans le README principal
- [ ] Ajouter des exemples de calcul selon la norme OCDE

## 🐛 Points d'Attention

1. **Valeurs par défaut** : Tous les taux doivent être initialisés à 0
2. **Validation de somme** : `humanitesScientifiques + humanitesTechniques ≤ 100%`
3. **Cohérence logique** : `tauxFilles ≤ tauxGF` pour chaque filière
4. **Optionnalité** : Le champ doit être optionnel (pas obligatoire à la création)
5. **Rétrocompatibilité** : Les rapports existants sans ce champ doivent continuer à fonctionner
6. **Classification OCDE** : Respecter les normes internationales de classification des filières

## 📚 Références

- [Classification ISCED de l'UNESCO](https://uis.unesco.org/fr/topic/classification-internationale-type-de-leducation-cite)
- [Statistiques de l'OCDE sur l'éducation](https://www.oecd.org/fr/education/)
