# Spécification Backend - Correction Section Visites des Classes

**Date:** 15 février 2026  
**Priorité:** HAUTE  
**Section affectée:** `ameliorationQualite.visitesEtReunions.visitesClasses`

---

## 🔴 PROBLÈME ACTUEL

### Bug Identifié dans le Frontend

Dans le composant `EvaluationQualitativeComplete.tsx` (lignes 2150-2310), la section **III.2.1. Fréquences des Visites des Classes** présente un bug critique:

**3 lignes distinctes dans l'UI:**
- a) ECE (Espace Communautaire d'Éveil)
- b) Préprimaire  
- c) Maternel

**Mais les 3 radio buttons modifient le MÊME champ:** `visitesClasses.prescolaire`

**Conséquence:** Sélectionner un radio button dans n'importe quelle ligne (ECE, Préprimaire ou Maternel) modifie les 3 lignes simultanément.

---

## 📊 STRUCTURE ACTUELLE (INCORRECTE)

### Backend actuel:
```json
{
  "ameliorationQualite": {
    "visitesEtReunions": {
      "visitesClasses": {
        "prescolaire": "TRES BON",   // ⚠️ UN SEUL champ pour TOUT le préscolaire
        "primaire": "BON",
        "secondaire": "TRES BON",
        "special": "BON"
      }
    }
  }
}
```

### Problème:
- Impossible de différencier les évaluations entre ECE, Préprimaire et Maternel
- Les 3 sous-niveaux du préscolaire partagent la même valeur

---

## ✅ STRUCTURE ATTENDUE (CORRECTE)

### Option 1 - Structure Plate (Recommandée):
```json
{
  "ameliorationQualite": {
    "visitesEtReunions": {
      "visitesClasses": {
        "ece": "TRES BON",           // ✅ Champ distinct pour ECE
        "preprimaire": "BON",        // ✅ Champ distinct pour Préprimaire
        "maternel": "ASSEZ BON",     // ✅ Champ distinct pour Maternel
        "primaire": "BON",
        "secondaire": "TRES BON",
        "special": "BON"
      }
    }
  }
}
```

### Option 2 - Structure Imbriquée (Alternative):
```json
{
  "ameliorationQualite": {
    "visitesEtReunions": {
      "visitesClasses": {
        "prescolaire": {
          "ece": "TRES BON",
          "preprimaire": "BON",
          "maternel": "ASSEZ BON"
        },
        "primaire": "BON",
        "secondaire": "TRES BON",
        "special": "BON"
      }
    }
  }
}
```

**Recommandation:** Option 1 (structure plate) car elle est cohérente avec d'autres sections existantes.

---

## 🔄 COHÉRENCE AVEC D'AUTRES SECTIONS

### Sections qui SUPPORTENT DÉJÀ les 3 sous-niveaux:

#### 1. `disponibiliteMoyensEnseignement.programmesScolaires`:
```json
"programmesScolaires": {
  "ece": "TRES BON",          // ✅ Déjà séparé
  "preprimaire": "TRES BON",   // ✅ Déjà séparé
  "maternel": "TRES BON",      // ✅ Déjà séparé
  "primaire": "TRES BON",
  "secondaire": "TRES BON",
  "prescolaire": "TRES BON"    // + champ global optionnel
}
```

#### 2. `activitesInspectorales.themesExploites`:
```json
"themesExploites": {
  "ece": "Développement psychomoteur et socialisation",      // ✅ Déjà séparé
  "maternel": "Apprentissage par le jeu et activités sensorielles"  // ✅ Déjà séparé
}
```

### Sections qui DOIVENT ÊTRE CORRIGÉES:

Les sections suivantes doivent également supporter les 3 sous-niveaux:

1. ✅ `visitesEtReunions.visitesClasses` (objet de cette spec)
2. ⚠️ `visitesEtReunions.reunionsPedagogiques` (même problème)
3. ⚠️ `visitesEtReunions.fonctionnementCelluleBase` (même problème)

---

## 🔧 MODIFICATIONS BACKEND REQUISES

### 1. Schéma MongoDB (Mongoose)

**Avant:**
```javascript
visitesClasses: {
  prescolaire: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  primaire: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  secondaire: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  special: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  }
}
```

**Après:**
```javascript
visitesClasses: {
  ece: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  preprimaire: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  maternel: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  primaire: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  secondaire: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  },
  special: { 
    type: String, 
    enum: ['TRES BON', 'BON', 'ASSEZ BON'], 
    default: null 
  }
}
```

### 2. Validation Backend

Ajouter validation pour les nouveaux champs:
```javascript
// Dans le controller ou middleware de validation
if (req.body.ameliorationQualite?.visitesEtReunions?.visitesClasses) {
  const visitesClasses = req.body.ameliorationQualite.visitesEtReunions.visitesClasses;
  
  const validValues = ['TRES BON', 'BON', 'ASSEZ BON'];
  const validFields = ['ece', 'preprimaire', 'maternel', 'primaire', 'secondaire', 'special'];
  
  for (const field of validFields) {
    if (visitesClasses[field] && !validValues.includes(visitesClasses[field])) {
      return res.status(400).json({
        success: false,
        message: `Valeur invalide pour visitesClasses.${field}`
      });
    }
  }
}
```

### 3. Migration de Données Existantes

**Script de migration nécessaire:**
```javascript
// migration_visites_classes.js

async function migrateVisitesClasses() {
  try {
    const rapports = await RapportActivite.find({
      'ameliorationQualite.visitesEtReunions.visitesClasses.prescolaire': { $exists: true }
    });

    console.log(`${rapports.length} rapports à migrer`);

    for (const rapport of rapports) {
      const prescolaireValue = rapport.ameliorationQualite?.visitesEtReunions?.visitesClasses?.prescolaire;
      
      if (prescolaireValue) {
        // Option 1: Dupliquer la valeur actuelle sur les 3 nouveaux champs
        rapport.ameliorationQualite.visitesEtReunions.visitesClasses.ece = prescolaireValue;
        rapport.ameliorationQualite.visitesEtReunions.visitesClasses.preprimaire = prescolaireValue;
        rapport.ameliorationQualite.visitesEtReunions.visitesClasses.maternel = prescolaireValue;
        
        // Option 2: Supprimer l'ancien champ (si le schéma est strict)
        delete rapport.ameliorationQualite.visitesEtReunions.visitesClasses.prescolaire;
        
        await rapport.save();
      }
    }

    console.log('Migration terminée avec succès');
  } catch (error) {
    console.error('Erreur de migration:', error);
  }
}

// Exécuter la migration
migrateVisitesClasses();
```

---

## 📝 EXEMPLE DE REQUÊTE POST COMPLÈTE

**Endpoint:** `POST /api/v1/rapport-activite`

**Body (extrait pertinent):**
```json
{
  "identificationProved": "6970af4de0355a44bca8a5b9",
  "annee": "2024-2025",
  
  "ameliorationQualite": {
    "visitesEtReunions": {
      "visitesClasses": {
        "ece": "TRES BON",
        "preprimaire": "BON",
        "maternel": "ASSEZ BON",
        "primaire": "BON",
        "secondaire": "TRES BON",
        "special": "BON"
      },
      "reunionsPedagogiques": {
        "prescolaire": "TRES BON",
        "primaire": "BON",
        "secondaire": "BON"
      },
      "fonctionnementCelluleBase": {
        "prescolaire": "BON",
        "primaire": "BON",
        "secondaire": "TRES BON",
        "special": "BON"
      }
    }
  }
}
```

---

## 🚨 SECTIONS SUPPLÉMENTAIRES À VÉRIFIER

Ces sections utilisent aussi `prescolaire` de manière générique et pourraient nécessiter la même correction:

### 1. `reunionsPedagogiques`:
```json
// Actuel (à vérifier si séparation nécessaire)
"reunionsPedagogiques": {
  "prescolaire": "TRES BON",  // ⚠️ À subdiviser ?
  "primaire": "BON",
  "secondaire": "BON"
}
```

### 2. `fonctionnementCelluleBase`:
```json
// Actuel (à vérifier si séparation nécessaire)
"fonctionnementCelluleBase": {
  "prescolaire": "BON",  // ⚠️ À subdiviser ?
  "primaire": "BON",
  "secondaire": "TRES BON",
  "special": "BON"
}
```

**Question pour validation:** Le frontend présente-t-il aussi 3 lignes séparées pour ces sections ?

---

## ✅ CHECKLIST IMPLÉMENTATION

### Backend:
- [ ] Modifier le schéma Mongoose pour `visitesClasses`
- [ ] Retirer le champ `prescolaire` de `visitesClasses`
- [ ] Ajouter les champs `ece`, `preprimaire`, `maternel`
- [ ] Mettre à jour la validation des données
- [ ] Créer et exécuter le script de migration
- [ ] Tester la création de nouveau rapport
- [ ] Tester la modification de rapport existant
- [ ] Vérifier les rapports migrés

### Frontend (déjà identifié):
- [ ] Modifier `EvaluationQualitativeComplete.tsx` lignes 2150-2310
- [ ] Changer les 3 lignes pour utiliser `ece`, `preprimaire`, `maternel`
- [ ] Mettre à jour l'interface TypeScript `RapportActivite.ts`
- [ ] Tester le formulaire de création
- [ ] Tester le formulaire de modification
- [ ] Vérifier l'affichage des rapports existants

### Documentation:
- [ ] Mettre à jour `BACKEND_REQUIREMENTS.txt`
- [ ] Documenter les changements dans le CHANGELOG
- [ ] Informer l'équipe frontend des changements

---

## 🔗 RÉFÉRENCES

- **Fichier frontend concerné:** `src/pages/RapportActivite/components/EvaluationQualitativeComplete.tsx` (lignes 2150-2310)
- **Interface TypeScript:** `src/models/RapportActivite.ts` (ligne 332+)
- **Fichier JSON test:** `rapport_data_filled.json` (ligne 315)
- **Spec backend:** `BACKEND_REQUIREMENTS.txt`

---

## 💡 RECOMMANDATION FINALE

**Pour éviter ce type de problème à l'avenir:**

1. **Uniformiser la nomenclature du préscolaire** dans TOUTES les sections:
   - Soit utiliser partout: `ece`, `preprimaire`, `maternel`
   - Soit utiliser partout: `prescolaire` (sans subdivision)

2. **Choisir une stratégie cohérente:**
   - Si subdivision nécessaire → utiliser les 3 champs partout
   - Si subdivision non nécessaire → utiliser `prescolaire` générique partout

3. **Documentation:** Créer un document définissant la hiérarchie officielle des niveaux d'enseignement

---

**Contact:** Pour questions ou clarifications, contacter l'équipe de développement frontend.
