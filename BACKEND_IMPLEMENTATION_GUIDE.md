# Guide d'Implémentation Backend - Indicateurs de Rendement (III.8)

## 📋 Vue d'Ensemble

Ce guide détaille l'implémentation complète de la section **III.8 - Indicateurs de Rendement** dans le backend, incluant les **3 nouvelles sous-sections** qui doivent être ajoutées.

## 🎯 Sections à Implémenter

| Section | Status | Documentation |
|---------|--------|---------------|
| A. Efficacité Primaire | ✅ Existant | [BACKEND_EFFICACITE_PRIMAIRE_SPEC.md](BACKEND_EFFICACITE_PRIMAIRE_SPEC.md) |
| B. Efficacité Secondaire | ❌ À ajouter | [BACKEND_EFFICACITE_SECONDAIRE_SPEC.md](BACKEND_EFFICACITE_SECONDAIRE_SPEC.md) |
| C. Taux de Diplômés OCDE | ❌ À ajouter | [BACKEND_TAUX_DIPLOMES_OCDE_SPEC.md](BACKEND_TAUX_DIPLOMES_OCDE_SPEC.md) |

## 🏗️ Architecture Complète

### Structure JSON Finale

```json
{
  "ameliorationQualite": {
    "indicateursRendement": {
      "rendementInterne": { /* ... 5 niveaux */ },
      "rendementExterne": { /* ... 10 niveaux */ },
      "efficacitePrimaire": {
        "tauxAbandon": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxReussite": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxEchec": { "tauxGF": 0, "tauxFilles": 0 }
      },
      "efficaciteSecondaire": {
        "tauxAbandon": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxReussite": { "tauxGF": 0, "tauxFilles": 0 },
        "tauxEchec": { "tauxGF": 0, "tauxFilles": 0 }
      },
      "tauxDiplomesOCDE": {
        "humanitesScientifiques": { "tauxGF": 0, "tauxFilles": 0 },
        "humanitesTechniques": { "tauxGF": 0, "tauxFilles": 0 }
      }
    }
  }
}
```

## 💻 Implémentation Step-by-Step

### Étape 1 : Créer les Schemas Mongoose

**Fichier** : `models/rapportActivite.model.js` (ou similaire)

```javascript
const mongoose = require('mongoose');

// ============================================
// SCHEMAS PARTAGÉS
// ============================================

// Schema pour les indicateurs avec tauxGF et tauxFilles
const IndicateurTauxSchema = new mongoose.Schema({
  tauxGF: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: props => `${props.value} n'est pas un taux valide (0-100)`
    }
  },
  tauxFilles: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: props => `${props.value} n'est pas un taux valide (0-100)`
    }
  }
}, { _id: false });

// ============================================
// EFFICACITÉ PRIMAIRE (Existant - pour référence)
// ============================================

const EfficacitePrimaireSchema = new mongoose.Schema({
  tauxAbandon: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  tauxReussite: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  tauxEchec: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  }
}, { _id: false });

// ============================================
// EFFICACITÉ SECONDAIRE (NOUVEAU)
// ============================================

const EfficaciteSecondaireSchema = new mongoose.Schema({
  tauxAbandon: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  tauxReussite: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  tauxEchec: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  }
}, { _id: false });

// ============================================
// TAUX DE DIPLÔMÉS OCDE (NOUVEAU)
// ============================================

const TauxDiplomesOCDESchema = new mongoose.Schema({
  humanitesScientifiques: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  },
  humanitesTechniques: {
    type: IndicateurTauxSchema,
    default: () => ({ tauxGF: 0, tauxFilles: 0 })
  }
}, { _id: false });

// ============================================
// SCHEMA PRINCIPAL - INDICATEURS RENDEMENT
// ============================================

const IndicateursRendementSchema = new mongoose.Schema({
  // Rendement Interne (déjà existant)
  rendementInterne: {
    sixiemePrimaire: {
      abandon: { type: Number, default: 0 },
      reussite: { type: Number, default: 0 },
      echec: { type: Number, default: 0 }
    },
    huitiemeCETB: {
      abandon: { type: Number, default: 0 },
      reussite: { type: Number, default: 0 },
      echec: { type: Number, default: 0 }
    },
    quatriemeHumanite: {
      abandon: { type: Number, default: 0 },
      reussite: { type: Number, default: 0 },
      echec: { type: Number, default: 0 }
    },
    diplomesMathematiques: {
      abandon: { type: Number, default: 0 },
      reussite: { type: Number, default: 0 },
      echec: { type: Number, default: 0 }
    },
    diplomesFiliereTechniques: {
      abandon: { type: Number, default: 0 },
      reussite: { type: Number, default: 0 },
      echec: { type: Number, default: 0 }
    }
  },
  
  // Rendement Externe (déjà existant)
  rendementExterne: {
    prescolaire: { type: IndicateurTauxSchema, default: () => ({}) },
    espaceCommunautaireEveil: { type: IndicateurTauxSchema, default: () => ({}) },
    classePreprimaire: { type: IndicateurTauxSchema, default: () => ({}) },
    maternel: { type: IndicateurTauxSchema, default: () => ({}) },
    primaire: { type: IndicateurTauxSchema, default: () => ({}) },
    enseignementSpecialPrimaire: { type: IndicateurTauxSchema, default: () => ({}) },
    enseignementPrimaire: { type: IndicateurTauxSchema, default: () => ({}) },
    secondaire: { type: IndicateurTauxSchema, default: () => ({}) },
    enseignementSpecialSecondaire: { type: IndicateurTauxSchema, default: () => ({}) },
    enseignementSecondaireNormal: { type: IndicateurTauxSchema, default: () => ({}) }
  },
  
  // Efficacité Primaire (déjà existant)
  efficacitePrimaire: {
    type: EfficacitePrimaireSchema,
    default: () => ({
      tauxAbandon: { tauxGF: 0, tauxFilles: 0 },
      tauxReussite: { tauxGF: 0, tauxFilles: 0 },
      tauxEchec: { tauxGF: 0, tauxFilles: 0 }
    })
  },
  
  // ========== NOUVEAUX CHAMPS ==========
  
  // Efficacité Secondaire (NOUVEAU)
  efficaciteSecondaire: {
    type: EfficaciteSecondaireSchema,
    required: false,
    default: () => ({
      tauxAbandon: { tauxGF: 0, tauxFilles: 0 },
      tauxReussite: { tauxGF: 0, tauxFilles: 0 },
      tauxEchec: { tauxGF: 0, tauxFilles: 0 }
    })
  },
  
  // Taux de Diplômés OCDE (NOUVEAU)
  tauxDiplomesOCDE: {
    type: TauxDiplomesOCDESchema,
    required: false,
    default: () => ({
      humanitesScientifiques: { tauxGF: 0, tauxFilles: 0 },
      humanitesTechniques: { tauxGF: 0, tauxFilles: 0 }
    })
  }
}, { _id: false });

module.exports = { IndicateursRendementSchema };
```

### Étape 2 : Créer les Fonctions de Validation

**Fichier** : `validators/indicateursRendement.validator.js` (nouveau)

```javascript
/**
 * Valide la structure efficaciteSecondaire
 */
function validateEfficaciteSecondaire(data) {
  if (!data) return { valid: true, errors: [] };
  
  const indicateursRequis = ['tauxAbandon', 'tauxReussite', 'tauxEchec'];
  const errors = [];

  indicateursRequis.forEach(indicateur => {
    if (!data[indicateur]) return;

    const { tauxGF, tauxFilles } = data[indicateur];

    // Validation des plages
    if (tauxGF < 0 || tauxGF > 100) {
      errors.push(`${indicateur}.tauxGF doit être entre 0 et 100`);
    }
    if (tauxFilles < 0 || tauxFilles > 100) {
      errors.push(`${indicateur}.tauxFilles doit être entre 0 et 100`);
    }

    // Cohérence logique
    if (tauxFilles > tauxGF) {
      errors.push(`${indicateur}: tauxFilles ne peut pas dépasser tauxGF`);
    }
  });

  // Validation de la somme (≈ 100%)
  if (data.tauxAbandon && data.tauxReussite && data.tauxEchec) {
    const sommeGF = data.tauxAbandon.tauxGF + data.tauxReussite.tauxGF + data.tauxEchec.tauxGF;
    if (Math.abs(sommeGF - 100) > 0.5) {
      errors.push(`La somme des taux GF (${sommeGF.toFixed(1)}%) devrait être proche de 100%`);
    }

    const sommeFilles = data.tauxAbandon.tauxFilles + data.tauxReussite.tauxFilles + data.tauxEchec.tauxFilles;
    if (Math.abs(sommeFilles - 100) > 0.5) {
      errors.push(`La somme des taux Filles (${sommeFilles.toFixed(1)}%) devrait être proche de 100%`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valide la structure tauxDiplomesOCDE
 */
function validateTauxDiplomesOCDE(data) {
  if (!data) return { valid: true, errors: [] };
  
  const filieresRequises = ['humanitesScientifiques', 'humanitesTechniques'];
  const errors = [];

  filieresRequises.forEach(filiere => {
    if (!data[filiere]) return;

    const { tauxGF, tauxFilles } = data[filiere];

    // Validation des plages
    if (tauxGF < 0 || tauxGF > 100) {
      errors.push(`${filiere}.tauxGF doit être entre 0 et 100`);
    }
    if (tauxFilles < 0 || tauxFilles > 100) {
      errors.push(`${filiere}.tauxFilles doit être entre 0 et 100`);
    }

    // Cohérence logique
    if (tauxFilles > tauxGF) {
      errors.push(`${filiere}: tauxFilles ne peut pas dépasser tauxGF`);
    }
  });

  // Validation de la somme (≤ 100%)
  if (data.humanitesScientifiques && data.humanitesTechniques) {
    const sommeGF = data.humanitesScientifiques.tauxGF + data.humanitesTechniques.tauxGF;
    if (sommeGF > 100) {
      errors.push(`La somme des taux GF (${sommeGF.toFixed(1)}%) ne peut pas dépasser 100%`);
    }

    const sommeFilles = data.humanitesScientifiques.tauxFilles + data.humanitesTechniques.tauxFilles;
    if (sommeFilles > 100) {
      errors.push(`La somme des taux Filles (${sommeFilles.toFixed(1)}%) ne peut pas dépasser 100%`);
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateEfficaciteSecondaire,
  validateTauxDiplomesOCDE
};
```

### Étape 3 : Mettre à Jour le Controller

**Fichier** : `controllers/rapportActivite.controller.js`

```javascript
const { validateEfficaciteSecondaire, validateTauxDiplomesOCDE } = require('../validators/indicateursRendement.validator');

// Dans la méthode CREATE ou UPDATE
async function createOrUpdateRapport(req, res) {
  try {
    const data = req.body;
    
    // Validation des nouvelles sections si présentes
    const indicateurs = data.ameliorationQualite?.indicateursRendement;
    
    if (indicateurs?.efficaciteSecondaire) {
      const validation = validateEfficaciteSecondaire(indicateurs.efficaciteSecondaire);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Données efficaciteSecondaire invalides',
          errors: validation.errors
        });
      }
    }
    
    if (indicateurs?.tauxDiplomesOCDE) {
      const validation = validateTauxDiplomesOCDE(indicateurs.tauxDiplomesOCDE);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Données tauxDiplomesOCDE invalides',
          errors: validation.errors
        });
      }
    }
    
    // Continuer avec la création/mise à jour...
    const rapport = await RapportActivite.create(data);
    
    res.status(201).json({
      success: true,
      data: rapport,
      message: 'Rapport créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

### Étape 4 : Tester l'Implémentation

**Fichier de test** : `tests/indicateursRendement.test.js`

```javascript
const request = require('supertest');
const app = require('../app');

describe('Indicateurs Rendement - Nouvelles Sections', () => {
  
  let token;
  let rapportId;
  
  beforeAll(async () => {
    // S'authentifier et obtenir un token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ identifier: '+243899312592', motDePasse: '1234' });
    token = loginRes.body.token;
  });
  
  describe('POST /api/rapport-activite - efficaciteSecondaire', () => {
    it('devrait créer un rapport avec efficaciteSecondaire', async () => {
      const res = await request(app)
        .post('/api/rapport-activite')
        .set('Authorization', `Bearer ${token}`)
        .send({
          annee: '2024-2025',
          identificationProved: '6970af4de0355a44bca8a5b9',
          ameliorationQualite: {
            indicateursRendement: {
              efficaciteSecondaire: {
                tauxAbandon: { tauxGF: 6.8, tauxFilles: 6.2 },
                tauxReussite: { tauxGF: 84.7, tauxFilles: 83.1 },
                tauxEchec: { tauxGF: 8.5, tauxFilles: 10.7 }
              }
            }
          }
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ameliorationQualite.indicateursRendement.efficaciteSecondaire).toBeDefined();
      rapportId = res.body.data._id;
    });
    
    it('devrait rejeter des taux invalides', async () => {
      const res = await request(app)
        .post('/api/rapport-activite')
        .set('Authorization', `Bearer ${token}`)
        .send({
          annee: '2024-2025',
          identificationProved: '6970af4de0355a44bca8a5b9',
          ameliorationQualite: {
            indicateursRendement: {
              efficaciteSecondaire: {
                tauxAbandon: { tauxGF: 150, tauxFilles: 6.2 } // Invalide
              }
            }
          }
        });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('POST /api/rapport-activite - tauxDiplomesOCDE', () => {
    it('devrait créer un rapport avec tauxDiplomesOCDE', async () => {
      const res = await request(app)
        .post('/api/rapport-activite')
        .set('Authorization', `Bearer ${token}`)
        .send({
          annee: '2024-2025',
          identificationProved: '6970af4de0355a44bca8a5b9',
          ameliorationQualite: {
            indicateursRendement: {
              tauxDiplomesOCDE: {
                humanitesScientifiques: { tauxGF: 88.5, tauxFilles: 86.2 },
                humanitesTechniques: { tauxGF: 86.1, tauxFilles: 82.4 }
              }
            }
          }
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ameliorationQualite.indicateursRendement.tauxDiplomesOCDE).toBeDefined();
    });
  });
});
```

## ✅ Checklist Complète

### Schema & Validation
- [ ] Créer `EfficaciteSecondaireSchema`
- [ ] Créer `TauxDiplomesOCDESchema`
- [ ] Ajouter les schemas à `IndicateursRendementSchema`
- [ ] Créer `validateEfficaciteSecondaire()`
- [ ] Créer `validateTauxDiplomesOCDE()`

### Controller
- [ ] Mettre à jour `createRapport()` pour valider les nouveaux champs
- [ ] Mettre à jour `updateRapport()` pour valider les nouveaux champs
- [ ] Gérer les erreurs de validation correctement

### Tests
- [ ] Tester la création avec `efficaciteSecondaire`
- [ ] Tester la création avec `tauxDiplomesOCDE`
- [ ] Tester les validations (taux > 100, taux négatifs, etc.)
- [ ] Tester la rétrocompatibilité (rapports sans ces champs)

### Documentation
- [ ] Mettre à jour le README principal
- [ ] Ajouter des exemples dans la documentation API
- [ ] Documenter les règles de validation

### Déploiement
- [ ] Créer une migration si nécessaire
- [ ] Tester sur l'environnement de staging
- [ ] Déployer en production
- [ ] Vérifier l'intégration avec le frontend

## 🧪 Commandes de Test Rapide

```bash
# 1. Se connecter et récupérer le token
curl -X POST https://www.edu-nc.site/api/v1/proved/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "+243899312592",
    "motDePasse": "1234"
  }' | jq -r '.token' > token.txt

# Stocker le token dans une variable
export TOKEN=$(cat token.txt)

# 2. Créer un rapport complet avec le fichier rapport_data_filled.json
curl -X POST https://www.edu-nc.site/api/v1/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @rapport_data_filled.json | jq '.' > response.json

# Extraire l'ID du rapport créé
export RAPPORT_ID=$(cat response.json | jq -r '.data._id')

# 3. Vérifier la structure complète
curl -X GET https://www.edu-nc.site/api/v1/rapport-activite/$RAPPORT_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.data.ameliorationQualite.indicateursRendement'

# 4. Tester efficaciteSecondaire uniquement
curl -X POST https://www.edu-nc.site/api/v1/rapport-activite \
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
  }' | jq '.'

# 5. Tester tauxDiplomesOCDE uniquement
curl -X POST https://www.edu-nc.site/api/v1/rapport-activite \
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
  }' | jq '.'

# 6. Tester la validation (devrait échouer)
curl -X POST http://localhost:5000/api/rapport-activite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ameliorationQualite": {
      "indicateursRendement": {
        "efficaciteSecondaire": {
          "tauxAbandon": { "tauxGF": 150 }
        }
      }
    }
  }' | jq '.'
```

## 📚 Références

- [BACKEND_EFFICACITE_PRIMAIRE_SPEC.md](BACKEND_EFFICACITE_PRIMAIRE_SPEC.md)
- [BACKEND_EFFICACITE_SECONDAIRE_SPEC.md](BACKEND_EFFICACITE_SECONDAIRE_SPEC.md)
- [BACKEND_TAUX_DIPLOMES_OCDE_SPEC.md](BACKEND_TAUX_DIPLOMES_OCDE_SPEC.md)
- [BACKEND_RENDEMENT_INTERNE_SPEC.md](BACKEND_RENDEMENT_INTERNE_SPEC.md)
- [BACKEND_RENDEMENT_EXTERNE_SPEC.md](BACKEND_RENDEMENT_EXTERNE_SPEC.md)

## 🆘 Support

Pour toute question sur l'implémentation :
1. Consulter les specs détaillées de chaque section
2. Vérifier les exemples de données dans `rapport_data_filled.json`
3. Tester avec les commandes cURL fournies
